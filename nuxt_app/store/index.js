export const state = () => ({
	//serverURL: 'http://ikbel.xyz:3030', // https://trumpnewsfeed.com
	serverURL: process.env.baseURL,
})

console.log(process.env.baseURL)