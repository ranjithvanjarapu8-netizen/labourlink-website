const container = document.getElementById("wageContainer");

const token = localStorage.getItem("token");

loadWages();

async function loadWages() {

    try {

        const response = await fetch("https://labourlink-2v5e.onrender.com/api/wages/all", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to load wages");
        }

        const data = await response.json();

        container.innerHTML = "";

        data.forEach(profession => {

            let workRows = "";

            profession.works.forEach(work => {

                workRows += `
                    <tr>
                        <td>${work.name}</td>
                        <td>₹${work.price}</td>
                        <td>${work.estimatedHours} hrs</td>
                        <td>${work.description}</td>
                    </tr>
                `;

            });

            container.innerHTML += `
                <div class="profession-card">

                    <div class="card-header">

                        <h2>${profession.profession}</h2>

                        <div class="daily-wage">
                            ₹${profession.dailyWage} / Day
                        </div>

                    </div>

                    <table>

                        <thead>
                            <tr>
                                <th>Work</th>
                                <th>Price</th>
                                <th>Estimated Time</th>
                                <th>Description</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${workRows}
                        </tbody>

                    </table>

                </div>
            `;

        });

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <h2 style="text-align:center;color:red;">
                Unable to load wage details.
            </h2>
        `;
    }

}