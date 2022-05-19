import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import * as tf from '@tensorflow/tfjs'
//import { setWasmPath } from '@tensorflow/tfjs-backend-wasm'
import * as DogsNCats from "dogs-n-cats"
//import * as fs from 'fs'
import { getThreadsCount, setThreadsCount } from '@tensorflow/tfjs-backend-wasm'
import { type } from 'os'
import { OutgoingMessage } from 'http'

//setThreadsCount(2)
//setWasmPath('tfjs-backend-wasm-threaded-simd.wasm')
//tf.setBackend('wasm')
tf.setBackend('webgl')

export interface I {
  image: any
}

export interface O {
  probability: any
}

export default class CatDetector extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['image'],
        o: ['probability'],
      },
      {},
      system,
      pod
    )
  }

  async f({ image }: I, done: Done<O>): Promise<void> {
    /*const {
      api: {
        neural: { detectCat },
      },
    } = this.__system

    let probability

    try {
      probability = await detectCat(image)
    } catch (err) {
      done(undefined, err.message)
      return
    }*/
    async function tellmecatordog() {


      let dnc, model, prob
      const epochsCount = 1


      async function loadData(): Promise<void> {
        console.log('Loading Dataset.....')
        dnc = await DogsNCats.load()
        console.log('Dataset Loaded')

      }

      async function createModel(): Promise<void> {
        console.log('Creating model...')
        model = tf.sequential()
        model.add(
          tf.layers.conv2d({
            inputShape: [32, 32, 3],
            kernelSize: 3,
            padding: "same",
            filters: 32,
            strides: 1,
            activation: "relu",
            kernelInitializer: "heNormal"
          })
        )

        //downsample, batchnorm, and dropout
        model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }))
        model.add(tf.layers.batchNormalization())
        model.add(tf.layers.dropout({ rate: 0.25 }))

        model.add(
          tf.layers.conv2d({
            kernelSize: 3,
            filters: 64,
            padding: "same",
            strides: 1,
            activation: "relu",
            kernelInitializer: "heNormal"
          })
        )
        model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }))
        model.add(tf.layers.batchNormalization())
        model.add(tf.layers.dropout({ rate: 0.25 }))

        // flatten the output from the 2D filters into a 1D vector to prepare it for input into our last layer.
        model.add(tf.layers.flatten())

        // complex dense intermediate
        model.add(
          tf.layers.dense({
            units: 64,
            // kernelRegularizer: "l1l2", // Slows progress but helps overfit
            activation: "relu",
            kernelInitializer: "heNormal"
          })
        )

        // last layer is a dense layer which has 1 final output
        model.add(
          tf.layers.dense({
            units: 1,
            activation: "sigmoid"
          })
        )
        // choose an optimizer, loss function and accuracy metric, then compile and return the model
        model.compile({
          optimizer: "adam", // or use tf.train.adam() to adjust
          loss: "binaryCrossentropy",
          metrics: ["accuracy"]
        })
        console.log("Model Created")

      }

      async function train(): Promise<void> {
        console.log("Gathering training data")
        const [trainX, trainY] = dnc.training.get(1600)
        const [testX, testY] = dnc.test.get(400)

        const printCallback = {
          onEpochEnd: (epoch, log) => {
            console.log(epoch, log)
          }
        }


        console.log("Training Has Started")
        const history = await model.fit(trainX, trainY, {
          batchSize: 128,
          validationData: [testX, testY],
          epochs: epochsCount,
          shuffle: true,
          callbacks: printCallback
        })
        console.log("Training Complete")
        console.log("Training History", history)
        console.log("Cleaning up training/testing data")
        tf.dispose(trainX)
        tf.dispose(trainY)
        tf.dispose(testX)
        tf.dispose(testY)
      }

      async function predict(): Promise<void> {
        console.log("Grab real world dog")
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = "http://192.168.29.183:4000/dataset/cats/cat.10.jpg" //add image here

        /*img.onload = () => {
          const imgTensor = tf.browser.fromPixels(img)

          const prediction = model.predict(imgTensor.expandDims())
          prob = prediction.dataSync()
          console.log(prob)
        }*/
        img.onload = () => {
          tf.tidy(() => {
            console.log("Real world dog image loaded")
            const imgTensor = tf.browser.fromPixels(img)
            const alignCorners = true
            const newSize = 32
            const resized = tf.image.resizeBilinear(imgTensor, [newSize, newSize], alignCorners)
            const prediction = model.predict(resized.expandDims())
            prob = prediction.dataSync()
            console.log("Predicted", prob)
          })
      }


    }
      await loadData()
      await createModel()
      await train()
      await predict()
    }

    //tellmecatordog()


    /*
        console.log("Grab real world dog")
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = "http://192.168.29.183:4000/cat.jpg" //add image here
        img.onload = () => {
          tf.tidy(() => {
            console.log("Real world dog image loaded")
            const imgTensor = tf.browser.fromPixels(img)
            const alignCorners = true
            const newSize = 32
            const resized = tf.image.resizeBilinear(imgTensor, [newSize, newSize], alignCorners)
          
            console.log(imgTensor)
          })
        }
    
        console.log('Outside')
    */
    let testvar

    const worker = new Worker('worker-javascript/_catDetectorWorker.js', { type: "module" })
    worker.addEventListener("message", event => {
      console.log("inside from catDetector")
      //testvar = event.data
      //console.log(testvar)

    })


    done({ probability: 5 })
  }
}
