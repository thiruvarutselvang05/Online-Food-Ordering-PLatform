const handleAuthSubmit = async (e) => {
    e.preventDefault();

    // This is the new part: sending data to your server
    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form), // Send the whole form
      });

      const data = await response.json();

      const messageBox = document.createElement("div");
      messageBox.className = "alert-message-box";

      if (!response.ok) {
        // If response is not 2xx, show the error message from the server
        messageBox.innerText = `Sign Up Failed: ${data.message}`;
      } else {
        // SUCCESS!
        messageBox.innerText = `Sign Up Successful! You can now log in.`;
        // You would typically redirect the user to the login page here
      }
      
      document.body.appendChild(messageBox);
      setTimeout(() => messageBox.remove(), 3000);

    } catch (error) {
      console.error("Sign up fetch error:", error);
      const messageBox = document.createElement("div");
      messageBox.className = "alert-message-box";
      messageBox.innerText = `Error: Could not connect to server.`;
      document.body.appendChild(messageBox);
      setTimeout(() => messageBox.remove(), 3000);
    }

    // Clear sensitive fields after attempt
    setForm({ ...form, password: "", confirmPassword: "" });
  };