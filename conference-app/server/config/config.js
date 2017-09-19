module.exports = {
    'port': process.env.PORT || 3000,
    'apiKey': process.env.TOKBOX_API || '',
    'apiSecret': process.env.TOKBOX_SECRET || '',
    'mongodb': process.env.MONGOURL || ''
};