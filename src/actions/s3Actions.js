
import {actionTypes} from '../actions/types'
import axios from 'axios';
import { isValid } from '../utils/standardization';
import {basePath} from '../configurations/config';





export function deletePostS3(file, path, deletePath, config2, successfulCallback) {

    return function(dispatch) {
        const formData = new FormData();
        formData.append('file',file);
        formData.append('filePath', path);
        formData.append('deleteFilePath',deletePath);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': (isValid(config2) && isValid(config2.headers) && isValid(config2.headers.Authorization))?config2.headers.Authorization:"NA"
            }
        }
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.post( basePath + '/s3/deleteupdate',formData , config )
         .then(res => {
             
            successfulCallback(true, res.data.content);
            // res.data.content = objectStandardizer(res.data.content, modelAttributeMapping.PRODUCT_INFO_MODEL );
            // dispatch({
            //     type: actionTypes.ITEM_POST,
            //     payload: res.data.content
            // })
            
         })
         .catch( error => {
            successfulCallback(false);
            dispatch({
                type: actionTypes.MESSAGE_CHANGE,
                payload: error
            })
         })
    }
    
}
