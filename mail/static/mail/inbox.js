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
  document.querySelector('#unique-email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector('#compose-form').onsubmit = () => {
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
  };
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#unique-email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

      // Show the emails list in mailbox selected
      emails.forEach(email =>  {
        const element = document.createElement('div');
        element.style.border = 'solid';
        element.style.marginTop = '5px';
        if (mailbox === 'sent') {
          element.innerHTML = email["recipients"] + ' - ' + email["subject"] + ' - ' + email["timestamp"];
        }else {
          element.innerHTML = email["sender"] + ' - ' + email["subject"] + ' - ' + email["timestamp"];
        }
        if (email["read"] !== true){
          element.style.backgroundColor = "white";
        }else {
          element.style.backgroundColor = "gray";
        }
        element.addEventListener('click', () => {
          console.log('This element has been clicked!')
          // mark_as_read_unread(email["id"], true);
          // element.style.backgroundColor = "gray";
          view_email(email["id"]);
        });
        document.querySelector('#emails-view').append(element);
      })
      
  });
}

function mark_as_read_unread(email_id, isRead){
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
    read: isRead
    })
  })
  .then(email => {
    // Print email
    console.log(email);
  });
}

function view_email(email_id){
  // Show the mail content and hide others views
  document.querySelector('#unique-email-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';

  fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
      // Print email
      console.log(email);

      mark_as_read_unread(email_id, true)

      // ... do something else with email ...
      document.querySelector('#view-recipients').innerHTML = email.recipients;
      document.querySelector('#view-subject').innerHTML = email.subject;
      document.querySelector('#view-timestamp').innerHTML = email.timestamp;
      document.querySelector('#view-body').innerHTML = email.body;

      document.querySelector('#button-unread').addEventListener('click', () => {
        mark_as_read_unread(email_id, false)
        // load_mailbox(`${mailbox}`);
      });
    });
}