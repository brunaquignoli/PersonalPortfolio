async function loadProjects(){

    const response = await fetch(
        "https://api.github.com/users/brunaquignoli/repos"
    );

    const repos = await response.json();

    const container =
        document.getElementById("spotligthcards");

    repos.slice(0,3).forEach(repo => {

        container.innerHTML += `

        <div class="projectcard">
            <h2>${repo.name}</h2>
            <p>
              ${repo.description || "Sem descrição"}
            </p>
            <span class="language">
              ${repo.language || "Sem linguagem"}
            </span>
            <a href="${repo.html_url}"
               target="_blank">
               Ver no GitHub
            </a>
        </div>

        `;
        console.log(repo);

    });

}

loadProjects();
