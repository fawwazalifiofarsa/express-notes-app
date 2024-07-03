document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      sessionStorage.setItem("user_id", data._id);
      sessionStorage.setItem("accessToken", data.accessToken);
      window.location.href = "./"; 
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } 
  });
});
