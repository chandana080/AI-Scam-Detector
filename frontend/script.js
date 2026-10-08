async function checkMessage() {
    const message = document.getElementById("message").value.trim();
    const result = document.getElementById("result");

    if (!message) {
        result.innerHTML = `<p class="input-error">Please enter a message to analyze.</p>`;
        return;
    }

    result.innerHTML = `
        <div class="loading-state">
            <span class="loader"></span>
            <p>Analyzing message...</p>
        </div>
    `;

    try {
        const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: message })
        });

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();

        const isScam = data.prediction === "SCAM";
        const confidence = Number(data.confidence);
        const safeConfidence = Number.isFinite(confidence)
            ? Math.min(100, Math.max(0, confidence))
            : null;

        result.innerHTML = `
            <div class="result-card ${isScam ? "scam-result" : "safe-result"}">

                <div class="result-top">
                    <span class="result-label">
                        ANALYSIS RESULT
                    </span>

                    <span class="status-badge">
                        ${isScam ? "HIGH ATTENTION" : "NON-SPAM"}
                    </span>
                </div>

                <h2 class="result-title">
                    ${isScam ? "Potential Spam Detected" : "No Spam Detected"}
                </h2>

                <p class="result-description">
                    ${isScam
                        ? "This message matches patterns associated with spam."
                        : "The model classified this message as non-spam."
                    }
                </p>

                <div class="confidence-block">
                    <div class="confidence-heading">
                        <span>Model confidence</span>
                        <strong>
                            ${safeConfidence === null
                                ? "N/A"
                                : safeConfidence.toFixed(2) + "%"
                            }
                        </strong>
                    </div>

                    <div class="confidence-track">
                        <div class="confidence-fill"
                             style="width: ${safeConfidence ?? 0}%">
                        </div>
                    </div>
                </div>

                <div class="analyzed-message-block">
                    <h3>Analyzed Message</h3>
                    <p class="analyzed-message"></p>
                </div>

                <p class="result-disclaimer">
                    AI predictions may be incorrect. Verify suspicious messages independently.
                </p>

            </div>
        `;

        result.querySelector(".analyzed-message").textContent = data.message;

    } catch (error) {
        result.innerHTML = `
            <p class="input-error">
                Unable to analyze the message. Please check that the backend is running.
            </p>
        `;

        console.error("Prediction error:", error);
    }
}