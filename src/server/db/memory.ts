import { CloudDB, SharedDB, Store, UserDB } from '.'
import { Dict } from '../../types/Dict'
import { clone } from '../../util/object'
import { UserSpec } from '../model/UserSpec'

const DATA_USER_ID_TO_USER: Dict<UserSpec> = {
  'd7911fce-7186-11eb-83a6-9bdac43a93d2': {
    userId: 'd7911fce-7186-11eb-83a6-9bdac43a93d2',
    username: 'samuelmtimbo',
    email: 'samuelmtimbo@gmail.com',
    password: '$2y$12$4xulLACyZjRJSTlLcjXAz.4k5ocy6G9jnnqF8bQHxOTqWKpEyDKRu',
    customerId: null,
    pictureUrl: null,
  },
  'a4c347e8-7a0a-11eb-a8b0-07ec8d2fe415': {
    userId: 'a4c347e8-7a0a-11eb-a8b0-07ec8d2fe415',
    username: 'mt.samuel2',
    email: 'mt.samuel2@gmail.com',
    password: '$2y$12$4xulLACyZjRJSTlLcjXAz.4k5ocy6G9jnnqF8bQHxOTqWKpEyDKRu',
    customerId: null,
    pictureUrl: null,
  },
}

const DATA_EMAIL_TO_USER_ID: Dict<string> = {
  'samuelmtimbo@gmail.com': 'd7911fce-7186-11eb-83a6-9bdac43a93d2',
  'mt.samuel2@gmail.com': 'a4c347e8-7a0a-11eb-a8b0-07ec8d2fe415',
}

const DATA_USERNAME_TO_USER_ID: Dict<string> = {
  samuelmtimbo: 'd7911fce-7186-11eb-83a6-9bdac43a93d2',
  'mt.samuel2': 'a4c347e8-7a0a-11eb-a8b0-07ec8d2fe415',
}

const DATA_CLOUD: Dict<Dict<any[]>> = {
  graph: {
    'd7911fce-7186-11eb-83a6-9bdac43a93d2': [
      {
        name: 'my picture',
        units: {
          image: {
            id: '059579bb-184f-435b-ace0-64ec95c9f125',
            input: {
              src: {
                data: 'http://public.it.localhost:5000/picture.jpg',
              },
              style: {},
            },
            output: {},
          },
        },
        merges: {},
        inputs: {
          style: {
            name: 'style',
            pin: {
              '0': {
                unitId: 'image',
                pinId: 'style',
              },
            },
          },
        },
        outputs: {},
        metadata: {
          icon: null,
          description: 'nothing inside',
          complexity: 4.161895674300254,
        },
        id: '278936b2-fead-11ea-a3e7-6b56d0e4b202',
        component: {
          defaultWidth: 172.81640625,
          defaultHeight: 230.3125,
          subComponents: {
            image: {
              children: [],
              width: 172.81640625,
              height: 230.3125,
            },
          },
          children: ['image'],
        },
      },
      {
        name: 'min max slider',
        units: {
          numberinput: {
            id: '9bc56564-ef4e-11ea-939a-27ae3feb321e',
            input: {
              value: {},
              style: {
                ignored: true,
              },
              min: {
                ignored: false,
              },
              max: {
                ignored: false,
              },
            },
            output: {},
          },
          slider: {
            id: 'e06518cf-9edf-430b-8751-74c486e407aa',
            input: {
              style: {
                ignored: true,
              },
              value: {},
              min: {
                ignored: false,
              },
              max: {
                ignored: false,
              },
            },
            output: {},
          },
          oninput: {
            id: 'b345c410-b1ee-11ea-b725-0b9ed734d65f',
            input: {
              element: {},
            },
            output: {
              event: {},
            },
          },
          setvalue: {
            id: 'ad68ca8e-ff63-467d-a770-3e6a7490f7fb',
            input: {
              element: {},
              value: {},
            },
            output: {},
          },
          oninput0: {
            id: 'b345c410-b1ee-11ea-b725-0b9ed734d65f',
            input: {
              element: {},
            },
            output: {
              event: {},
            },
          },
          setvalue0: {
            id: 'ad68ca8e-ff63-467d-a770-3e6a7490f7fb',
            input: {
              element: {},
              value: {},
            },
            output: {},
          },
          max: {
            id: '9bc56564-ef4e-11ea-939a-27ae3feb321e',
            input: {
              value: {
                data: 100,
              },
              style: {
                ignored: true,
              },
              min: {
                ignored: true,
              },
              max: {
                ignored: true,
              },
            },
            output: {},
          },
          oninput1: {
            id: 'b345c410-b1ee-11ea-b725-0b9ed734d65f',
            input: {
              element: {},
            },
            output: {
              event: {},
            },
          },
          min: {
            id: '9bc56564-ef4e-11ea-939a-27ae3feb321e',
            input: {
              value: {},
              style: {
                ignored: true,
              },
              min: {
                ignored: true,
              },
              max: {
                ignored: true,
              },
            },
            output: {},
            metadata: {
              component: {
                width: 120,
                height: 45,
              },
            },
          },
          oninput2: {
            id: 'b345c410-b1ee-11ea-b725-0b9ed734d65f',
            input: {
              element: {},
            },
            output: {
              event: {},
            },
          },
          vgnyhv: {
            id: 'ad5a2fcc-fdee-11ea-a34f-77e9c48dbe57',
            input: {
              style: {},
            },
            output: {},
          },
          erfaxmfs: {
            id: '67a6fb5a-feab-11ea-8bd1-a3c19e76592a',
            input: {
              style: {},
            },
            output: {},
          },
          gwmdyifn: {
            id: 'b345c410-b1ee-11ea-b725-0b9ed734d65f',
            input: {
              element: {},
            },
            output: {
              event: {},
            },
          },
          tpavgk: {
            id: 'b345c410-b1ee-11ea-b725-0b9ed734d65f',
            input: {
              element: {},
            },
            output: {
              event: {},
            },
          },
        },
        component: {
          subComponents: {
            numberinput: {
              children: [],
            },
            slider: {
              children: [],
            },
            max: {
              children: [],
            },
            min: {
              children: [],
              width: 120,
              height: 45,
            },
            vgnyhv: {
              children: ['min', 'numberinput', 'max'],
            },
            erfaxmfs: {
              children: ['slider', 'vgnyhv'],
              width: 278,
              height: 85,
            },
          },
          children: ['erfaxmfs'],
          defaultWidth: 210,
          defaultHeight: 120,
        },
        metadata: {
          icon: 'sliders-h',
          complexity: 40,
          tags: ['platform', 'core', 'component'],
        },
        merges: {
          zppynw: {
            oninput: {
              input: {
                element: true,
              },
            },
            numberinput: {
              output: {
                _self: true,
              },
            },
            setvalue0: {
              input: {
                element: true,
              },
            },
          },
          zifdlhqi: {
            setvalue: {
              input: {
                element: true,
              },
            },
            slider: {
              output: {
                _self: true,
              },
            },
            oninput0: {
              input: {
                element: true,
              },
            },
          },
          bvubmjxo: {
            setvalue0: {
              input: {
                value: true,
              },
            },
            oninput0: {
              output: {
                event: true,
              },
            },
          },
          vaufopf: {
            max: {
              output: {
                _self: true,
              },
            },
            oninput1: {
              input: {
                element: true,
              },
            },
            gwmdyifn: {
              input: {
                element: true,
              },
            },
          },
          iltnvkkw: {
            oninput2: {
              input: {
                element: true,
              },
            },
            min: {
              output: {
                _self: true,
              },
            },
            tpavgk: {
              input: {
                element: true,
              },
            },
          },
          ezwsb: {
            setvalue: {
              input: {
                value: true,
              },
            },
            oninput: {
              output: {
                event: true,
              },
            },
          },
          zzmfgw: {
            numberinput: {
              input: {
                max: true,
              },
            },
            gwmdyifn: {
              output: {
                event: true,
              },
            },
          },
          soblkxus: {
            oninput1: {
              output: {
                event: true,
              },
            },
            slider: {
              input: {
                max: true,
              },
            },
          },
          odaeytf: {
            tpavgk: {
              output: {
                event: true,
              },
            },
            slider: {
              input: {
                min: true,
              },
            },
          },
          kxsvjbukp: {
            oninput2: {
              output: {
                event: true,
              },
            },
            numberinput: {
              input: {
                min: true,
              },
            },
          },
        },
        id: '0d9605e4-f4f2-4141-a7f0-1f090c88230f',
        inputs: {
          max: {
            pin: {
              '0': {
                unitId: 'max',
                pinId: 'value',
              },
              vtjbjuvw: {
                mergeId: 'zzmfgw',
              },
              ckkotbhab: {
                mergeId: 'soblkxus',
              },
            },
          },
          min: {
            pin: {
              '0': {
                mergeId: 'odaeytf',
              },
              lmxgapmoa: {
                unitId: 'min',
                pinId: 'value',
              },
              ehxxshptb: {
                mergeId: 'kxsvjbukp',
              },
            },
          },
          value: {
            pin: {
              '0': {
                unitId: 'slider',
                pinId: 'value',
              },
              iwqrfsvcw: {
                unitId: 'numberinput',
                pinId: 'value',
              },
            },
          },
        },
        outputs: {},
      },
      {
        name: 'delete porn history',
        units: {
          searchdeletevisits: {
            id: 'dd22949e-ad44-4571-9af4-322a1e194ebe',
            input: {
              text: {},
            },
            output: {},
          },
          wait: {
            id: 'ba38b0af-80c0-49e4-9e39-864396964ccc',
            input: {
              a: {
                constant: true,
                data: 'porn',
              },
              b: {},
            },
            output: {
              a: {},
            },
          },
        },
        merges: {
          albyrgass: {
            wait: {
              output: {
                a: true,
              },
            },
            searchdeletevisits: {
              input: {
                text: true,
              },
            },
          },
        },
        inputs: {
          any: {
            pin: {
              '0': {
                unitId: 'wait',
                pinId: 'b',
              },
            },
          },
        },
        outputs: {},
        metadata: {
          icon: 'alicorn',
          description: '',
          complexity: 7,
        },
        component: {
          render: false,
          subComponents: {
            searchdeletevisits: {
              children: [],
            },
          },
          children: ['searchdeletevisits'],
          defaultWidth: 28,
          defaultHeight: 28,
        },
        id: 'ea18d5c1-c784-4d2f-88f7-5d48b204523a',
      },
    ],
  },
  web: {
    'd7911fce-7186-11eb-83a6-9bdac43a93d2': [
      {
        title: 'Empty',
        unit: {
          id: 'e33e7dcd-9715-461c-a474-15ed2bda899e',
        },
        host: 'ioun.ly',
        state: 'deployed',
        public: true,
      },
      {
        title: 'Notebook',
        unit: {
          id: '83ec6688-b80b-4ef2-861f-14245ef392c0',
          input: {
            value: {
              data: 'Hello World',
            },
            style: {
              data: {
                fontSize: 24,
              },
            },
          },
        },
        host: 'ioun.ly',
        state: 'idle',
        public: false,
      },
    ],
  },
  vm: {
    'd7911fce-7186-11eb-83a6-9bdac43a93d2': [
      {
        name: 'MacBook Pro',
        platform: 'computer',
        state: {
          connection: {
            status: 'connected',
            err: null,
          },
          units: {},
        },
      },
      {
        name: 'Cloud Container',
        platform: 'cloud',
        state: {
          connection: {
            status: 'connected',
            err: null,
          },
          units: {},
        },
      },
      {
        name: 'Home Automation',
        platform: 'computer',
        state: {
          connection: {
            status: 'error',
            err: null,
          },
          units: {},
        },
      },
      {
        name: 'Pixel 3',
        platform: 'mobile',
        state: {
          connection: {
            status: 'connected',
            err: null,
          },
          units: {},
        },
      },
    ],
  },
}

export const DATA_SHARED: Dict<Dict<any[]>> = {
  graph: {
    'd7911fce-7186-11eb-83a6-9bdac43a93d2': [],
    'a4c347e8-7a0a-11eb-a8b0-07ec8d2fe415': [
      {
        userId: 'd7911fce-7186-11eb-83a6-9bdac43a93d2',
        entryId: '278936b2-fead-11ea-a3e7-6b56d0e4b202',
      },
    ],
  },
}

export function createMemoryStore<T>(
  name: string,
  DATA: Dict<Dict<any[]>>
): Store<T> {
  let table = DATA[name] || {}

  return {
    get: (userId: string, id: string) => {
      const user = table[userId] || {}
      const entry = user[id]
      return Promise.resolve(entry)
    },
    getAll: (userId: string) => {
      const user = table[userId] || []
      return Promise.resolve(user)
    },
    create: (userId: string, id: string, entry: T) => {
      if (table === undefined) {
        table = {}
        DATA[name] = table
      }
      let user = table[userId]
      if (user === undefined) {
        user = []
        table[userId] = user
      }
      user.push(entry)
      return Promise.resolve(entry)
    },
    delete: (userId: string, id: string) => {
      let user = table[userId]

      const index = Number.parseInt(id)

      user.splice(index, 1)

      return Promise.resolve()
    },
    put: (userId: string, id: string, entry: T) => {
      let user = table[userId]
      user[id] = entry
      return Promise.resolve(entry)
    },
  }
}

export const memoryUserDB: UserDB = {
  get: (userId: string) => {
    const user = clone(DATA_USER_ID_TO_USER[userId] || null)
    return Promise.resolve(user)
  },
  getByEmail: (email: string) => {
    const userId = DATA_EMAIL_TO_USER_ID[email] || null
    if (userId) {
      return memoryUserDB.get(userId)
    } else {
      return Promise.resolve(null)
    }
  },
  getByUsername: (username: string) => {
    const userId = DATA_USERNAME_TO_USER_ID[username] || null
    if (userId) {
      return memoryUserDB.get(userId)
    } else {
      return Promise.resolve(null)
    }
  },
  create: (user: UserSpec) => {
    const { userId, email, username } = user
    DATA_USER_ID_TO_USER[userId] = user
    DATA_EMAIL_TO_USER_ID[email] = userId
    DATA_USERNAME_TO_USER_ID[username] = userId
    return Promise.resolve(user)
  },
  patch: async function (user_id: string, partial: Partial<UserSpec>) {
    const user = await this.get(user_id)
    const patched = { ...user, ...partial }
    return this.create(patched)
  },
}

export const memoryCloudDB: CloudDB = {
  graph: createMemoryStore('graph', DATA_CLOUD),
  web: createMemoryStore('web', DATA_CLOUD),
  vm: createMemoryStore('vm', DATA_CLOUD),
}

export const memorySharedDB: SharedDB = {
  graph: createMemoryStore('graph', DATA_SHARED),
  web: createMemoryStore('web', DATA_SHARED),
  vm: createMemoryStore('vm', DATA_SHARED),
}
