import Framework7 from 'framework7/framework7.esm.bundle';
import $$ from 'dom7';
import firebase from 'firebase/app';
import app from "./F7App.js";
import 'firebase/database';
import 'firebase/auth';



$$("#tab2").on("tab:show", () => {
    //put in firebase ref here
    const sUser = firebase.auth().currentUser.uid;
    firebase.database().ref("cruditems/" + sUser).on("value", (snapshot) =>{
        const oItems = snapshot.val();
        console.log("oItems:",Object.keys(oItems));
        const aKeys = Object.keys(oItems);
        $$("#gameList").html("");
        for(let n = 0; n < aKeys.length; n++){
            if(oItems[aKeys[n]].datePurchased != null){
            let sCard = `
            <div class="card">
            <div class="row">
            <div class="column">
            <img src="${oItems[aKeys[n]].img}" style="height: 100px;width:100px;">
            <div class="card-content card-content-padding"><strike>${oItems[aKeys[n]].gameName}</strike></div>
            <div class="card-content card-content-padding"><strike>${oItems[aKeys[n]].genre}</strike></div>
            <div class="card-content card-content-padding"><strike>${oItems[aKeys[n]].price}</strike></div>
            </div>
            <div class="column">
            <div class="list">
            <br>
            <ul><li><button id="add_${aKeys[n]}" type="submit" class="button button-active grnButton update">Purchase</button></li>
            <br>
            <li>
            <button id="delete_${aKeys[n]}" type="submit" class="button button-active grnButton remove">Remove</button>
            </li>
            </ul>
            </div>
            </div>
            </div>
            </div>
            `
            $$("#gameList").append(sCard);
            }
            else{
                let sCard = `
                <div class="card">
                <div class="row">
                <div class="column">
                <img src="${oItems[aKeys[n]].img}" style="height: 100px;width:100px;">
                <div class="card-content card-content-padding">${oItems[aKeys[n]].gameName}</div>
                <div class="card-content card-content-padding">${oItems[aKeys[n]].genre}</div>
                <div class="card-content card-content-padding">${oItems[aKeys[n]].price}</div>
                </div>
                <div class="column">
                <div class="list">
                <br>
                <ul><li><button id="add_${aKeys[n]}" type="submit" class="button button-active grnButton update">Purchase</button></li>
                <br>
                <li>
                <button id="delete_${aKeys[n]}" type="submit" class="button button-active grnButton remove">Remove</button>
                </li>
                </ul>
                </div>
                </div>
                </div>
                </div>
                `
                $$("#gameList").append(sCard);
            }
        }
    });
});

function hasClass(elem, className) {
    return elem.classList.contains(className);
}

document.getElementById("gameList").addEventListener("click", (evt) =>{
    if(hasClass(evt.target,"update")){
        const sUser = firebase.auth().currentUser.uid;
        const today = new Date();
        const datePurchase = today.getDate() +"-"+ (today.getMonth() + 1) +"-"+today.getFullYear();
        firebase.database().ref("cruditems/" + sUser + "/" + evt.target.id.replace("add_","")).update({datePurchased: datePurchase});
        document.getElementById(evt.target.id).disabled = true;
        document.getElementById(evt.target.id).style.visibility = "hidden";
    }
    else if(hasClass(evt.target,"remove")){
        const sUser = firebase.auth().currentUser.uid;
        firebase.database().ref("cruditems/"+sUser+"/"+evt.target.id.replace("delete_","")).remove();
    }
});
$$(".my-sheet").on("submit", e => {
    //submitting a new note
    e.preventDefault();
    const oData = app.form.convertToData("#addItem");
    const sUser = firebase.auth().currentUser.uid;
    const sId = new Date().toISOString().replace(".", "_");
    firebase.database().ref("cruditems/" + sUser + "/" + sId).set(oData);
    app.sheet.close(".my-sheet", true);
});
