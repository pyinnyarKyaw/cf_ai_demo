// document.getElementById("generate").onclick = async () => {
//   const theme = document.getElementById("theme").value;
//   const genre = document.getElementById("genre").value;

//   const res = await fetch("/generate", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ theme, genre }),
//   });

//   const data = await res.json();
//   document.getElementById("output").textContent = data.lyrics;
// };


document.getElementById("generate").onclick = async () => {
  const theme = document.getElementById("theme").value;
  const genre = document.getElementById("genre").value;

  document.getElementById("output").textContent = "Generating...";

  try {
    const res = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme, genre }),
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = await res.json();
    document.getElementById("output").textContent = data.lyrics || "No lyrics returned.";
  } catch (err) {
    document.getElementById("output").textContent = "Error: " + err.message;
  }
};

document.getElementById("history").onclick = async () => {
  try {
    const res = await fetch("/history");
    const data = await res.json();

    // Combine all lyrics into one string
    const allLyrics = data.map(item => item.lyrics).join("\n\n---\n\n");

    document.getElementById("output").textContent = allLyrics || "No history found.";
  } catch (err) {
    document.getElementById("output").textContent = "Error: " + err.message;
  }
};

