import { renderBundle } from '@_unit/unit/client/platform/web/render'

const root = document.getElementById('root')

const bundle = {
  spec: {
    name: 'hello world',
    units: {
      textbox: {
        id: '9988a56e-6bee-46c8-864c-e351d84bc7e2',
        input: {
          value: {
            data: "'hello world'",
          },
          style: {
            constant: true,
            data: {
              ref: [],
              data: {
                textAlign: 'center',
                fontFamily: 'Inconsolata',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '20vw',
              },
            },
          },
        },
      },
    },
    component: {
      subComponents: {
        textbox: {
          children: [],
        },
      },
      children: ['textbox'],
    },
  },
}

const [system, graph] = renderBundle(root, bundle)

const helloworld = graph.getUnit('helloworld')

helloworld.push('style', {
  color: '#ffdd00',
})
