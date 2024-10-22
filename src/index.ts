/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
export interface Env {
	DB: D1Database;
}

interface UserRequest {
	name: string;
	password: string;
	phone: string;
	email: string;
  }

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url)
		const method = request.method

		if(method == "GET" && url.pathname == "/getUsers"){
			return new Response("get an user")

		}

		else if (method == "POST" && url.pathname == "/createUser"){// naõ está funcionando
			const createUser = async(name:string, password:string, phone:string, email:string) => {
				env.DB.prepare(
					"INSERT INTO crud (name , email, phone, password) VALUES( ? , ? , ? , ?)"
				).bind(name,email,phone,password)
				.run()
			}
			try{
				const requestJson = await request.json() as UserRequest;
				const {name,password,phone,email} = requestJson
				await createUser(name,password,phone,email)
				return new Response(JSON.stringify(name))
			}
			catch(error){
				return new Response(JSON.stringify(error))
				// return new Response(JSON.stringify('status : 0 '))
			}

		}

		else if (method == "GET" && url.pathname == "/deleteUser"){
			return new Response("delete an user")

		}

		else if (method == "GET" && url.pathname == "/updateUser"){
			return new Response("update an user")

		}

		return new Response('Hello World!');
	},
} satisfies ExportedHandler<Env>;
