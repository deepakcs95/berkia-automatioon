const fetchInstagramToken = async () => {
    const url = "https://api.instagram.com/oauth/access_token";
    const formData = new URLSearchParams({
      client_id: "9584644174883499",
      client_secret: "69d2074e6b0423a7dc0998a77fda677c",
      grant_type: "authorization_code",
      redirect_uri: "https://3629-178-248-117-190.ngrok-free.app",
      code: "AQCF3FaNRr3Qe0Ug3b8HU5cRrewqzhERB2hjWOBL3Y-xNS6IasPbhMEuHgGmVw5amJ_Ob6-MTl7TBcucKRtT3f7zJAk7wD22ZVU711_g0lcikEbe-4ssMGlOscP5kvD9h_p5pyeNOA07IOJXWwY-bGNfpTpAGJXj6kijRhCURbpwAMQBHFpejrtRjbo9XHstk3ZEeq5D34OBmBg7wnqzmoPpRKOeXDWmE2RO80mDCktMXw"
    });
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Access token response:", data);
    } catch (error) {
      console.error("Error fetching Instagram token:", error);
    }
  };
  
  await fetchInstagramToken();
  