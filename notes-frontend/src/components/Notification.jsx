const Notification = ({ message }) => {
  if (message === null) {
    console.log("message is null")
    return null
  }

  console.log("Whats up with red line")
  return (
    <div className='error'>
      {message}
    </div>
  )
}

export default Notification
