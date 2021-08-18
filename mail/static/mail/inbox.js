document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector('#compose-form').onsubmit = send_email;

}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

      // ... do something else with emails ...

      // Show the emails list in mailbox selected
      for (let i in emails) {
        const element = document.createElement('div');
        element.style.border = 'solid';
        element.style.marginTop = '5px';
        if (mailbox === 'sent') {
          element.innerHTML = emails[i]["recipients"] + ' - ' + emails[i]["subject"] + ' - ' + emails[i]["timestamp"];
        }else {
          element.innerHTML = emails[i]["sender"] + ' - ' + emails[i]["subject"] + ' - ' + emails[i]["timestamp"];
        }
        element.addEventListener('click', function() {
          console.log('This element has been clicked!')

          fetch(`/emails/${emails[i]["id"]}`, {
            method: 'PUT',
            body: JSON.stringify({
            read: true
            })
          })
          .then(email => {
            // Print email
            console.log(email);
            // ... do something else with email ...
            element.style.backgroundColor = 'gray';
          });

        });
        document.querySelector('#emails-view').append(element);
      }

      // fetch('/emails/28')
      // .then(response => response.json())
      // .then(email => {
      //   // Print email
      //   console.log(email);
      //
      //   // ... do something else with email ...
      // });
      
  });
}

function send_email(){
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);

      // Load the user's sent mailbox
      load_mailbox('sent');

  });
  return false;
}