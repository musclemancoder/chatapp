//Socket Connection to listen
const socket = io()

//elements 
const $messageForm = document.querySelector('#messageForm'),
      $messageFormInput = $messageForm.querySelector('input'),
      $messageFormButton = $messageForm.querySelector('button'),
      $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
//templates
const messageTemplate = document.querySelector('#message-template').innerHTML;    
const locationTemplate = document.querySelector('#location-template').innerHTML;    


//Counter 
socket.on('countUpdated', (count) => {
    console.log('count has been updated', count)
})

document.querySelector('#increment').addEventListener('click', () => {
    socket.emit('increment')
})

//For Display messages
socket.on('Message', (msg) => {
    console.log(msg)
    const html = Mustache.render(messageTemplate,{message:msg.text,
                                                  createdAt: moment(msg.createdAt).format('h:mm a')  
                                                 })
    $messages.insertAdjacentHTML('beforeend',html)
});
document.querySelector('#messageForm').addEventListener('submit',(e)=>{
    e.preventDefault()
    console.log('submit')
    $messageFormButton.setAttribute('disabled', 'disabled')
    //const message = document.querySelector('input').value;
    const message =e.target.elements.message.value;
    socket.emit('sendMessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus()
        if(error){
           return console.log(error)
        }
        console.log('Message delivered!')
    })
})

//For location
socket.on('sendLocationMessage', (location) => {
    console.log(location)
    const html = Mustache.render(locationTemplate,{url:location.url,
        createdAt:moment(location.createdAt).format('h:mm a')  
                                                })
    $messages.insertAdjacentHTML('beforeend',html)
})

$sendLocationButton.addEventListener('click', (e) => {
    e.preventDefault();
    $sendLocationButton.setAttribute('disabled', 'disabled');
    if (!navigator.geolocation) {
        return alert('browser not supported !')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        $sendLocationButton.removeAttribute('disabled')
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }, (error) => {
            if (error) {
                return console.log(error)
            }
            console.log('Location Shared')
        })
    })
})