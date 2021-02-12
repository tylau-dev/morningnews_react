export default function(selectedLang = 'fr', action){
    if(action.type == 'changeLang'){
        return action.selectedLang
    } else {
        return selectedLang
    }
}