function handler (data, serverless, options) {
  console.log('Received Stack Output', data)
  console.log('Options', options)
  data.Region = options.region
}

module.exports = { handler }
