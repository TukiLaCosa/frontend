import { setPath } from "./setPath";
import { removeFromHand } from "./removeFromHand";
import cards from "./cards.JSON";
import axios from "axios";

export const playFlamethrower = async (activeId, id_player, id_victim, gameName) => {
  const makePostRequest = (activeId, id_player, id_victim) => {
    console.log('request:'+ activeId +"  " + id_player +"   "+ id_victim)
    return {
      "card_id": activeId,
      "player_id": id_player,
      "objective_player_id": id_victim,
    };
  };

  const request = makePostRequest(activeId, id_player, id_victim);

  try {
    const response = await axios.post(
      `http://localhost:8000/games/${gameName}/play-action-card`,
      request
    );
  } catch (error) {
    console.error("play-actcion-card-error", error);
  }
};

export const getAdjacents = (players, userId) => {
  /*En idVictim1 queda la posicion del jugador adyacente cuya posicion es menor */
  const findMaxPosition = (players) => {
    let maxPosition = null;
    for (let i = 0; i < players.length; i++) {
      const currentPosition = players[i].position;
      
      if (maxPosition === null || currentPosition > maxPosition) {
        maxPosition = currentPosition;
      }
    }
    return maxPosition;
  }
  const userPosition = players[players.findIndex(player => player.id === userId)].position
  const maxPosition = findMaxPosition(players)
  let idVictim1 = 0
  let idVictim2 = 0
  if (userPosition == 0) {
     idVictim1 = maxPosition;
  }
  else {
      idVictim1 = players.findIndex(player => player.position === userPosition - 1);
  }
  
  if (userPosition == maxPosition) {
    idVictim2 = 0
  }
  else {
    idVictim2 = players.findIndex(player => player.position === userPosition + 1);
  }

  return idVictim1,idVictim2;
}





// export const handleFlamethrower = (setShowPlayCardConfirmation,activeId,setGenActiveId) => {
//   setGenActiveId()
//   setShowFlamethrowerConfirmation(true)
// }

export const playCard = (
  setCardsPlayer,
  setPlayBG,
  activeId,
  setShowFlamethrowerConfirmation
) => {
  const activeCard = cards.cards[activeId - 1].name;

  if (activeCard === "The Thing" || activeCard === "Infected!") {
    alert("¡No se puede jugar esta carta!");
    return;
  }

  if (confirm("¿Quieres jugar esta carta?")) {
    const path = setPath(activeId);
    setPlayBG(path);
    removeFromHand(setCardsPlayer, activeId);

    switch (activeCard) {
      case "Infected!":
        console.log("Infected!");
        break;
      case "Flamethrower":
        console.log("Flamethrower");
        setShowFlamethrowerConfirmation(true)
        
        break;
      case "Analysis":
        console.log("Analysis");
        break;
      case "Axe":
        console.log("Axe");
        break;
      case "Suspicion":
        console.log("Suspicion");
        break;
      case "Whisky":
        console.log("Whisky");
        break;
      case "Determination":
        console.log("Determination");
        break;
      case "Watch Your Back":
        console.log("Watch Your Back");
        break;
      case "Switch":
        console.log("Switch");
        break;
      case "You Better Run":
        console.log("You Better Run");
        break;
      case "Seduction":
        console.log("Seduction");
        break;
      case "Frightening":
        console.log("Frightening");
        break;
      case "Im Fine Here":
        console.log("Im Fine Here");
        break;
      case "No, Thanks!":
        console.log("No, Thanks!");
        break;
      case "You Missed!":
        console.log("You Missed!");
        break;
      case "No Barbacue":
        console.log("No Barbacue");
        break;
      case "Quarantine":
        console.log("Quarantine");
        break;
      case "Locked Door":
        console.log("Locked Door");
        break;
      case "Rotten Ropes":
        console.log("Rotten Ropes");
        break;
      case "One, Two...":
        console.log("One, Two...");
        break;
      case "Three, Four...":
        console.log("Three, Four...");
        break;
      case "Is The Party Here?":
        console.log("Is The Party Here?");
        break;
      case "Get Out Of Here!":
        console.log("Get Out Of Here!");
        break;
      case "Forgetful":
        console.log("Forgetful");
        break;
      case "Round And Round":
        console.log("Round And Round");
        break;
      case "We Can Not Be Friends?":
        console.log("We Can Not Be Friends?");
        break;
      case "Blind Date":
        console.log("Blind Date");
        break;
      case "Ups!":
        console.log("Ups!");
        break;
      case "Let Stay It Between Us":
        console.log("Let Stay It Between Us");
        break;
      case "Revelations":
        console.log("Revelations");
        break;
      default:
        console.log("No lo se rick");
        break;
    }
  }
};
