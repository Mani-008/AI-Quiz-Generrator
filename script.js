async function generateQuiz() {
    const topic = document.getElementById("topic").value;
    const difficulty = document.getElementById("difficulty").value;
    const questionType = document.getElementById("questionType").value;
  
    const output = document.getElementById("output");
    output.innerHTML = "🧠 Generating quiz...";
  
    try {
      const res = await fetch("https://rw0p7wykjl.execute-api.us-east-1.amazonaws.com/prod/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, questionType })
      });
  
      const result = await res.json();
  
      let quiz;
      try {
        quiz = typeof result.body === "string" ? JSON.parse(result.body) : result.body;
        if (typeof quiz === "string") quiz = JSON.parse(quiz);
      } catch (err) {
        console.error("Parsing Error:", err);
        output.innerHTML = "❌ Error parsing quiz. Please try again.";
        return;
      }
  
      if (!quiz.quiz || !Array.isArray(quiz.quiz)) {
        output.innerHTML = `<pre>${JSON.stringify(quiz, null, 2)}</pre>`;
        return;
      }
  
      output.innerHTML = quiz.quiz.map((q, i) => `
        <div class="quiz-question">
          <h3>${i + 1}. ${q.text}</h3>
          <ul>
            ${q.options.map(opt => `
              <li>
                <label>
                  <input type="radio" name="q${i}" value="${opt.id}" />
                  ${opt.text}
                </label>
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('');
    } catch (err) {
      console.error(err);
      output.innerHTML = "❌ Failed to fetch quiz. Make sure your API is reachable.";
    }
  }
  