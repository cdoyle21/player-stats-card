class Player {
  constructor() {
    this.dropDown = document.getElementById('player__dropdown');
    this.getPlayerName = document.getElementById('player__name');
    this.playerPosition = document.getElementById('position');
    this.appearances = document.getElementById('appearances');
    this.goals = document.getElementById('goals');
    this.assists = document.getElementById('assists');
    this.goalsPerMatch = document.getElementById('goals__per__match');
    this.passesPerMinute = document.getElementById('passes__per__minute');
    this.mainPlayerImage = document.getElementById('player__image__main');
    this.clubBadgeImage = document.querySelector('.badge__image');
  }

  /**
   * Load the data in json form from URL provided. Catch errors if any are returned
   * @param {string} method - the fetch method that will be provided
   * @param {string} url - the URL provided that contains the data
   * @param {string} data - data that is output
   * @returns {response.json} - returns data
   *
   */
  async sendHttpRequest(method, url, data) {
    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        return response.json().then((errData) => {
          console.log(errData);
          throw new Error('Something went wrong - server-side.');
        });
      }
    } catch (error) {
      console.log(error);
      throw new Error('Something went wrong!');
    }
  }

  /**
   * Create dropdown objects with playerId's assigned to value. Fetch initial player
   * addEventListener to fetch other players based on value selected in dropdown
   *
   **/
  async fetchPlayer() {
    try {
      const responseData = await this.sendHttpRequest(
        'GET',
        'http://localhost:4000/player-stats'
      );
      const listOfContent = responseData.players;
      const initialPlayer = 4916;

      // create dropdown object options and assign playerId to value
      listOfContent.map((player, i) => {
        const players = listOfContent[i];
        const playerName =
          players.player.name.first + ' ' + players.player.name.last;
        this.getPlayerName.innerHTML = playerName;
        const playerId = players.player.id;
        this.dropDown.options.add(new Option(playerName, playerId));
      });
      this.getPlayerStats(initialPlayer);

      this.dropDown.addEventListener('change', (player) => {
        let playerId = this.dropDown.options[this.dropDown.selectedIndex].value;
        this.getPlayerStats(playerId);
      });
    } catch (error) {
      alert(error.message);
    }
  }

  /**
   * Get the player stats
   * @param {int} playerId - the player that has been selected from dropdown
   *
   **/
  async getPlayerStats(playerId) {
    const responseData = await this.sendHttpRequest(
      'GET',
      'http://localhost:4000/player-stats'
    );
    const listOfContent = responseData.players;

    listOfContent.map((player, i) => {
      const players = listOfContent[i];
      let appearances = 0;
      let goals = 0;
      let assists = 0;
      let fwdPass = 0;
      let backwardPass = 0;
      let minsPlayed = 0;

      players.stats.map((stat) => {
        if (playerId == players.player.id) {
          if (stat.name === 'appearances') {
            appearances = stat.value;
          }
          if (stat.name === 'goals') {
            goals = stat.value;
          }
          if (stat.name === 'goal_assist') {
            assists = stat.value;
          }
          if (stat.name === 'fwd_pass') {
            fwdPass = stat.value;
          }
          if (stat.name === 'backward_pass') {
            backwardPass = stat.value;
          }
          if (stat.name === 'mins_played') {
            minsPlayed = stat.value;
          }

          const playerImage = 'resources/images/p' + playerId + '.png';
          this.mainPlayerImage.src = playerImage;
          this.clubBadgeImage.style.backgroundPosition = this.getTeamBadge(
            players.player.currentTeam.shortName
          );
          const playerName =
            players.player.name.first + ' ' + players.player.name.last;
          const position = players.player.info.positionInfo;
          this.getPlayerName.innerHTML = playerName;
          this.playerPosition.innerHTML = position;
          this.appearances.innerHTML = appearances;
          this.goals.innerHTML = goals;
          this.assists.innerHTML = assists;
          this.goalsPerMatch.innerHTML = (goals / appearances).toFixed(2);
          this.passesPerMinute.innerHTML = (
            (fwdPass + backwardPass) /
            minsPlayed
          ).toFixed(2);
        }
      });
    });
  }

  /**
   * Get team badge based on what team they play for
   * @param {string} team - the team that the player plays for
   * @returns {string} - the backgroundPosition style that needs to be passed to sprite image in css
   *
   **/
  getTeamBadge(team) {
    switch (team) {
      case 'Spurs':
        return '-500px -1000px';
      case 'Man City':
        return '-800px -700px';
      case 'Man Utd':
        return '-600px -800px';
      case 'Arsenal':
        return '-100px -100px';
      case 'Leicester':
        return '0px 0px';
    }
  }
}
const playerstats = new Player();
playerstats.fetchPlayer();
