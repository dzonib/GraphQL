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
        body: 'WHAT UP bruuuh',
        published: true,
        author: 1
    },
    {
        id: 2,
        title: 'god',
        body: 'YOU ARE KING KONG',
        published: false,
        author: 1
    },
    {
        id: 3,
        title: 'what up',
        body: 'heeejaaaaa',
        published: true,
        author: 3
    },
]

const comments = [
    {
        id: 1,
        textFields: 'blablabla',
        author: 1,
        postId: 1
    },
    {
        id: 2,
        textFields: 'Hellooo',
        author: 2,
        postId: 1
    },
    {
        id: 3,
        textFields: 'Goodbyeee',
        author: 2,
        postId: 3
    },
    {
        id: 4,
        textFields: 'helogoodbyehellogoodbye',
        author: 1,
        postId: 1
    },
]

// Type definitions (schema)
const typeDefs = `
    type Query {
        posts(query: String): [Post!]!
        users(query: String): [User!]!
        me: User!
        post: Post!
        comments: [Comment!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        textFields: String!
        author: User!
        post: Post!
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
        },
        comments() {
            return comments
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => parent.author == user.id)
        },
        comments(parent, args, ctx, info) {
            return comments.filter(({postId}) => postId == parent.id)
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter(({author}) => parent.id == author)
        },
        comments(parent, args, ctx, info) {
            return comments.filter(({author}) => author === parent.id)
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => user.id == parent.author)
        },
        post(parent, args, ctx, info) {
            return posts.find(({id}) => parent.postId == id)
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})


server.start(() => console.log('Server is up'))