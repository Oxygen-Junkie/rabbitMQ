import http from 'http'
import amqp from 'amqplib'

const queueName = 'tasks'
let channel: amqp.Channel
const port = 1337

amqp.connect('amqp://rabbitmq').then((connection) => {
	connection.createChannel().then((v) => {
		channel = v
		channel.assertQueue(queueName).then(() => {
			console.log('М1 подключен к брокеру')
		})
	})
})

const postController = (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => {
	if (req.method == 'POST') {
		let body = ''
		req.on('data', (data) => {
			body += data
		})
		req.on('end', async () => {
			await channel.sendToQueue(queueName, Buffer.from(body), {
				replyTo: queueName
			})
			res.writeHead(200, {'Content-Type': 'application/json'})
			const result = await getResponseFromM2()
			console.log('Изменённый JSON полученный от rabbitMQ:')
			console.log(result)
			res.end(result)
		})
	}
}

http.createServer(postController).listen(port)

const getResponseFromM2 = async (): Promise<JSON> => {
	const resFromConsumer = (await channel.get(queueName))
	if (resFromConsumer) {
		let text = resFromConsumer.content.toString()!
		return JSON.parse(text)
	} else {
		await wait(150)
		return await getResponseFromM2()
	}
}

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));