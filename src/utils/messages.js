generateMessage = (text) => {
      return {
        text,
        createdAt: new Date().getTime()
      } 
}

generateLocation = (url) => {
      return {
        url,
        createdAt: new Date().getTime()
      } 
}

module.exports ={
    generateMessage,
    generateLocation
}