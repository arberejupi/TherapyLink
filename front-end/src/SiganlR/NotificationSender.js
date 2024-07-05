const sendNotification = (signalRHub,subject, message,toId,type,typeId,messageType,fromid = null) => {

  const id = fromid === null ? localStorage.getItem('userId'): fromid;
  const currentDate = new Date();

  const notificationRequest = {
    idNotification: '',
    subject: subject,
    body: message,
    fromId: id,
    toId: toId,
    type: type,
    typeId:typeId,
    messageType: messageType,
    dateTimestamp: currentDate,
  };

  signalRHub.invoke('SendNotificationToUser', notificationRequest)
    .catch(err => console.error(err));
};

export default sendNotification;