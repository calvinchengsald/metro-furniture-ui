import {actionTypes} from './types'


// Search is used for the /search endpoint
// when filtering products by base_code/type/subtype/tags
export function changeSearch( filterObject) {

    return function(dispatch) {

        dispatch({
            type: actionTypes.SEARCH_UDPATE,
            payload: filterObject
        })
    }
    


}

