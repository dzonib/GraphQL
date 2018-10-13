import { GraphQLServer } from 'graphql-yoga'


//Scalar types (type that stores single value) - String, Boolean, Int, Float, ID

// Demo user data
const users = [
    {
        id: 1,
        name: 'King Kong',
        email: 'example@gmail.com'
    },
    {
        id: 2,
        name: 'Test Guy',
        email: 'test@gmail.com',
        age: 1000
    },
    {
        id: 3,
        name: 'Stronk Guy',
        email: 'steroid@gmail.com',
        age: 51
    }
]

// demo posts data
const posts = [
    {
        id: 1,
        title: 'compliment',
        body: 'WHAT UP BJACH',
        published: true
    },
    {
        id: 2,
        title: 'stupid',
        body: 'YOU ARE KING KONG',
        published: false
    },
    {
        id: 3,
        title: 'what up',
        body: 'heeejaaaaa',
        published: true
    },
]

// Type definitions (schema)
const typeDefs = `
    type Query {
        posts(query: String): [Post]!
        users(query: String): [User!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (args.query) {
                return users.filter(({name}) => name.toLowerCase().includes(args.query.toLowerCase()))
            }
            return users
        },
        me() {
            return {
                id: 1,
                name: 'elvis',
                email: 'kingkong@blah.com',
                age: 3213123
            }
        },
        post() {
            return {
                id: 1,
                title: 'Compliment',
                body: 'You stink!',
                published: true
            }
        },
        posts(parent, args, ctx, info) {
            const {query} = args
            if (query) {
                return posts.filter(({title, body}) => title.toLowerCase().includes(query.toLowerCase()) 
                || body.toLowerCase().includes(query.toLowerCase()))
            }

            return posts
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})


server.start(() => console.log('Server is up'))