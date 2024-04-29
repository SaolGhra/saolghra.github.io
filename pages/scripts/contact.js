document
  .getElementById("contact-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    var formData = new FormData(this);
    var emailBody = "Name: " + formData.get("name") + "\n";
    emailBody += "Email: " + formData.get("email") + "\n";
    emailBody += "Message:\n" + formData.get("message");

    // Create mailto link
    var mailtoLink =
      "mailto:contact@saolghra.co.uk" +
      "?subject=Contact Form Submission" +
      "&body=" +
      encodeURIComponent(emailBody);

    // Open user's email client
    window.location.href = mailtoLink;
  });
