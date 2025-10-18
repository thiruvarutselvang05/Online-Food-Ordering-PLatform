const handleAuthSubmit = async (e) => {
    e.preventDefault();
    
    // This is the new part: sending data to your server
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      
      const messageBox = document.createElement("div");
      messageBox.className = "alert-message-box";

      if (!response.ok) {
        // If response is not 2xx, show the error message from the server
        messageBox.innerText = `Login Failed: ${data.message}`;
      } else {
        // SUCCESS!
        messageBox.innerText = `Login Successful!`;
        
        // --- Store the token ---
        // This is how your app "remembers" the user is logged in
        localStorage.setItem("token", data.token);

        // You would typically redirect the user here
        // e.g., window.location.href = "/dashboard";
      }
      
      document.body.appendChild(messageBox);
      setTimeout(() => messageBox.remove(), 3000);

    } catch (error) {
      console.error("Login fetch error:", error);
      const messageBox = document.createElement("div");
      messageBox.className = "alert-message-box";
      messageBox.innerText = `Error: Could not connect to server.`;
      document.body.appendChild(messageBox);
      setTimeout(() => messageBox.remove(), 3000);
    }

    // Clear password field
    setForm({ ...form, password: "" });
  };