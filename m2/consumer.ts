import amqp from 'amqplib'

const queueName = 'tasks'

amqp.connect('amqp://rabbitmq').then((connection) => {
	connection.createChannel().then((channel) => {
		channel.assertQueue(queueName).then(() => {
			console.log('М2 подключен к брокеру')
		})
		
		channel.consume(queueName, (message: amqp.ConsumeMessage | null) => {
			let text = message?.content.toString()!
			text = text.split('{').join('{"')
			text = text.split('}').join('"}')
			text = text.split(',').join('","')
			text = text.split(':').join('":"')
			const json = JSON.parse(text )
			Object.entries(json).forEach(([key, value]) => {
				const newValue = (value as string).split('').reverse().join('')
				console.log(`Значение поля ${key} было заменено с ${(value as string)} на ${newValue}`)
				json[key] = newValue
			})
			  channel.sendToQueue(message?.properties.replyTo, Buffer.from(JSON.stringify(json)))
			  channel.ack(message)
		})
	})
})