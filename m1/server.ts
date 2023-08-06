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
			await channel.sendToQueue(queueName, Buffer.from(body))
			res.writeHead(200, {'Content-Type': 'text/plain'})
			const result = await getResponseFromM2()
			res.end(result)
		})
	}
}

http.createServer(postController).listen(port)

const getResponseFromM2 = async () => {
	const resFromConsumer = (await channel.get(queueName))
	if (resFromConsumer) {
		return JSON.parse(resFromConsumer.content.toString()!)
	} else {
		setTimeout(getResponseFromM2, 200)
	}
}