import {actionTypes} from './types'


// Information Actio refers to the actial page that displays all the product info
export function changeInformation( informationObject) {

    return function(dispatch) {

        dispatch({
            type: actionTypes.INFORMATION_UPDATE,
            payload: informationObject
        })
    }
    


}

