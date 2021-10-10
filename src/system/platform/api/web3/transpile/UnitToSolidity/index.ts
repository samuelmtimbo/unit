import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { Config } from '../../../../../../Class/Unit/Config'
import { getSpec } from '../../../../../../client/spec'
import { _getSpecTypeInterface } from '../../../../../../spec/type'
import { GraphSpec } from '../../../../../../types'
import { Dict } from '../../../../../../types/Dict'
import _specs from '../../../../../_specs'
import * as soliditySpecs from './solidity_units.json'
// import * as graph420 from './../../../../../../port/solidity/assets/graph420.json'

export type I = {
  spec: GraphSpec
}

export type O = {
  sol: string
  entry: string
}

const unitToSolTypeMap = {
  number: 'int128',
  string: 'string memory',
  array: 'U.Datum[] memory',
  object: 'U.Datum[][] memory',
} as const
const unitToSolType = (u: string) => unitToSolTypeMap[u] ?? 'int128'

const solToUnitTypeMap = Object.entries(unitToSolTypeMap).reduce(
  (acc, [k, v]) => ({ ...acc, [v]: k }),
  {}
)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const solToUnitType = (u: string) => solToUnitTypeMap[u] ?? 'string'

const getUnitToOutputToMerge = (graph: GraphSpec) => {
  const { merges = {} } = graph

  return Object.entries(merges).reduce((acc, [mergeId, merge]) => {
    const outUnits = Object.keys(merge).filter((unit) => merge[unit].output)
    for (const unit of outUnits) {
      const outputs = merge[unit].output
      for (const outId of Object.keys(outputs)) {
        if (!outputs[outId]) continue
        acc[unit] = {
          ...acc[unit],
          [outId]: mergeId,
        }
      }
    }
    return acc
  }, {} as Dict<Dict<string>>)
}

const getGraphOutputsByUnit = (graph: GraphSpec) => {
  const { outputs = {} } = graph

  return Object.entries(outputs).reduce((acc, [outputId, output]) => {
    for (const pinId of Object.keys(output.pin)) {
      const pin = output.pin[pinId]
      if (pin.unitId && pin.pinId) {
        acc[pin.unitId] = {
          ...acc[pin.unitId],
          [pin.pinId]: [
            ...(acc[pin.unitId]?.[pin.pinId] ?? []),
            { outputId, pinId },
          ],
        }
      }
    }
    return acc
  }, {} as Dict<Dict<{ outputId: string; pinId: string }[]>>)
}

const mergesToInputs = (graph: GraphSpec) => {
  const { merges = {} } = graph

  return Object.entries(merges).reduce((acc, [mergeId, merge]) => {
    const inUnits = Object.keys(merge)
      .filter((unit) => merge[unit].input)
      .sort()
    for (const unit of inUnits) {
      const inputs = merge[unit].input
      const inputPairs = Object.entries(inputs)
        .filter(([_, enabled]) => enabled)
        .map(([input]) => ({
          unit,
          input,
        }))
      acc[mergeId] = [...(acc[mergeId] ?? []), ...inputPairs]
    }
    return acc
  }, {} as Dict<{ unit: string; input: string }[]>)
}

const toUpperCamel = (str: string) =>
  !str?.length ? '' : str[0].toUpperCase() + str.substr(1)

// prepare string to solidity symbol. strip whitespace and invalid chars
const symb = (name: string) =>
  name.replace(/\s+/g, '_').replace(/[^A-z0-9$_]+/g, '$')

export default class SpecToSolidity extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['spec'],
        o: ['sol', 'entry'],
      },
      config
    )
  }

  f({ spec: graph }: I, done: Done<O>): void {
    // graph = graph420 as any
    // console.log(graph)

    const {
      name = 'untitled',
      units = {},
      merges = {},
      inputs = {},
      outputs = {},
    } = graph

    const inputNames = Object.keys(inputs).sort()
    const outputNames = Object.keys(outputs).sort()
    const unitNames = Object.keys(units).sort()

    const graphType = _getSpecTypeInterface(graph, globalThis.__specs)
    const inputType = (name: string) =>
      graphType.input[name].value === 'any'
        ? 'number'
        : graphType.input[name].value
    const outputType = (name: string) => graphType.output[name].value

    const unitSpec = (name: string) => getSpec(units[name].path)

    const soliditySpec = (localName: string) => {
      const spec = unitSpec(localName)
      return soliditySpecs[spec.name]
    }
    const solInputIdx = (localName: string, inputName: string): number =>
      soliditySpec(localName).inputs.indexOf(inputName)
    const solOutputs = (localName: string): string[] =>
      soliditySpec(localName).outputs

    const outputsToMerges = getUnitToOutputToMerge(graph)
    const graphOutputs = getGraphOutputsByUnit(graph)

    const graphTypeName = `Graph_${symb(name)}`
    done({
      sol: `\
// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.20 >=0.8.9;

import './IMother.sol';
import './Heap.sol';
import './DataHolder.sol';

contract ${graphTypeName}_entry {
    Heap private heap = new Heap();

    ${graphTypeName} public graph;
    DataHolder public output = new DataHolder(${outputNames.length});

    constructor(address motherAddr) {
        require(motherAddr != address(0), 'Lost from mother');
        graph = new ${graphTypeName}(IMother(motherAddr));
        graph.init(heap, output.set);
    }

    // Inputs${inputNames
      .map((name) => ({ name, type: inputType(name) }))
      .map(
        ({ name, type }, idx) => `
    function input_${symb(name)}(${unitToSolType(type)} value) external {
        U.Datum memory datum = U.nit${toUpperCamel(type)}(heap, value);
        graph.input(${idx}, datum);
    }`
      )
      .join('\n')}

    // Outputs${outputNames
      .map((name) => ({
        name,
        stripped: symb(name),
        type: outputType(name),
        solType: unitToSolType(outputType(name)),
      }))
      .map(
        ({ stripped, type, solType }, idx) => `
    function peekOutput_${stripped}() public view returns (bool ok, ${solType} value) {
        U.Datum memory datum = output.get(${idx});
        if (datum.type_ == U.DType.Null) {
            return (false, ${solType}(0)); // TODO: make this work for non-number types
        }
        return (true, U.as${toUpperCamel(type)}(heap, datum));
    }

    function popOutput_${stripped}() external returns (bool ok, ${solType} value) {
        (ok, value) = peekOutput_${stripped}();
        output.set(${idx}, U.Datum(U.DType.Null, new uint32[](0)));
    }`
      )
      .join('\n')}
}

contract ${graphTypeName} is Unit {
    IMother private mother;

${unitNames
  .map(
    (name) => `\
    Unit public ${symb(name)};`
  )
  .join('\n')}

    constructor(IMother _mother) {
        mother = _mother;
    }

    function init(Heap _heap, function(uint32, U.Datum memory) external _outH)
        public
        override
        returns (Unit self)
    {
        self = this;
        super.init(_heap, _outH);

        // Fetch units from mother
${unitNames
  .map(
    (name) => `\
        ${name} = newUnit('${
      soliditySpec(name).name ?? unitSpec(name).name
    }', this.outHandler_${symb(name)});`
  )
  .join('\n')}

        // Units sent as self references\
${Object.entries(merges)
  .map(([mergeId, merge]) =>
    Object.entries(merge)
      .filter(([_, pins]) => pins.output?._self)
      .map(
        ([unit]) => `
        merge_${symb(mergeId)}(U.nitAddress(heap, address(${symb(unit)})));`
      )
      .join('')
  )
  .join('')}

        // TODO: Figure out how to set static data embedded in the graphs here.
    }

    function newUnit(
        string memory unit,
        function(uint32, U.Datum memory) external outHandler
    ) internal returns (Unit) {
        return mother.get(unit).factory.create(mother, heap, outHandler);
    }

    function input(uint32 idx, U.Datum memory datum) external override {
        ${inputNames
          .map((name) => inputs[name])
          .map(
            (input, idx) =>
              `${!idx ? `` : ' else '}if (idx == ${idx}) {\
${Object.entries(input.pin)
  .map(
    ([name, p]) =>
      `
            // pin ${name}
            ${
              p.mergeId
                ? `merge_${symb(p.mergeId)}(datum);`
                : p.unitId
                ? `${symb(p.unitId)}.input(${solInputIdx(
                    p.unitId,
                    p.pinId
                  )}, datum);`
                : `revert('unknown pin schema: ${JSON.stringify(p)}');`
            }`
  )
  .join('')}
        }`
          )
          .join('')}
    }

    // Output Handlers${unitNames
      .map(
        (unit) => `
    function outHandler_${symb(
      unit
    )}(uint32 idx, U.Datum memory datum) external {
        ${solOutputs(unit)
          .map((output, idx) => ({
            output,
            idx,
            merge: outputsToMerges[unit]?.[output],
            graphOuts: graphOutputs[unit]?.[output],
          }))
          .map(
            ({ idx, merge, graphOuts }) =>
              `${!idx ? `` : ' else '}if (idx == ${idx}) {
${
  !merge
    ? ``
    : `\
            merge_${symb(merge)}(datum);\n`
}\
${
  graphOuts
    ?.map(
      (gout) => `\
            // graph output pin ${gout.pinId}
            output(${outputNames.indexOf(gout.outputId)}, datum);\n`
    )
    ?.join('') ?? ''
}\
        }`
          )
          .join('')}
    }`
      )
      .join('\n')}

    // Merges${Object.entries(mergesToInputs(graph))
      .map(
        ([mergeId, unitInputs]) => `
    function merge_${symb(mergeId)}(U.Datum memory datum) internal {
${unitInputs
  .map(
    ({ unit, input }) => `\
        ${symb(unit)}.input(${solInputIdx(unit, input)}, datum);`
  )
  .join('\n')}
    }`
      )
      .join('\n')}
}

contract ${graphTypeName}_Factory is UnitFactory {
    function create(
        IMother mother,
        Heap heap,
        function(uint32, U.Datum memory) external outH
    ) external returns (Unit) {
        return new ${graphTypeName}(mother).init(heap, outH);
    }
}\n`,
      entry: `${graphTypeName}_entry`,
    })
  }
}
