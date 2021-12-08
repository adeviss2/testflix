import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ysgodvznfqhvyircozhg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODg5NjIxMSwiZXhwIjoxOTU0NDcyMjExfQ.tZW4-xU-e9LqsiwpR5WXlFZWKpqQM7efjMxglWi-Ags'
const supabase = createClient(supabaseUrl, supabaseKey);


const Sb = {
    get: async (table, id = null) => {
        let action;
        if(id !== null) {
            action = await supabase
                .from(table)
                .select()
                .eq('movie_id', id)
        } else {
            action = await supabase
                .from(table)
                .select()
        }

        const { data, error } = await action;

        if (error) {
            return {
                success: false,
                message: error.message,
            }
        } else {
            return {
                success: true,
                message: 'Query successful',
                data,
            }
        }
        
    },
    insert: async (table, dataObject) => {
        const { data, error } = await supabase.from(table).insert([dataObject]);
        if (error !== null) {
            return {
                success: false,
                message: error.message,
            }
        } else {
            return {
                success: true,
                message: 'Insert successful',
                data,
            }
        }
    },
    update: async (table, dataObject) => {
        const mid = dataObject.movie_id;
        delete dataObject.movie_id;
        const { data, error } = await supabase.from(table).update([dataObject]).eq('movie_id', mid);
        if (error !== null) {
            return {
                success: false,
                message: error.message,
            }
        } else {
            return {
                success: true,
                message: 'Upsert successful',
                data,
            }
        }
    },
    upsert: async (table, dataObject) => {
        const { data, error } = await supabase.from(table).upsert([dataObject]);
        if (error !== null) {
            return {
                success: false,
                message: error.message,
            }
        } else {
            return {
                success: true,
                message: 'Upsert successful',
                data,
            }
        }
    },
    user: async () => supabase.auth.user(),
    session: async () => supabase.auth.session(),
    signup: async (email, password, name) => {
        const { user, session, error } = await supabase.auth.signUp({
            email,
            password
        },
        {
          data: { 
            name,
          }
        });
        if (error !== null) {
            return {
                success: false,
                message: error.message,
            }
        } else {
            return {
                success: true,
                message: 'Signup successful',
                user,
                session,
            }
        }
    },
    login: async (email, password) => {
        const { user, session, error } = await supabase.auth.signIn({
            email,
            password,
        });
        if (error !== null) {
            return {
                success: false,
                message: error.message,
            }
        } else {
            return {
                success: true,
                message: 'Login successful',
                user,
                session,
            }
        }
    },
    logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error !== null) {
            return {
                success: false,
                message: error.message,
            }
        } else {
            return {
                success: true,
                message: 'Logout successful'
            }
        }
    }
};

export default Sb;
export { supabase };