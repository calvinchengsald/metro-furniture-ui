




export function insertionSort(arr)
{
  for (var i = 1; i < arr.length; i++) 
  {
    if (arr[i].item_code < arr[0].item_code) 
    {
      //move current element to the first position
      arr.unshift(arr.splice(i,1)[0]);
    } 
    else if (arr[i].item_code > arr[i-1].item_code) 
    {
      //leave current element where it is
      continue;
    } 
    else {
      //find where element should go
      for (var j = 1; j < i; j++) {
        if (arr[i].item_code > arr[j-1].item_code && arr[i].item_code < arr[j].item_code) 
        {
          //move element
          arr.splice(j,0,arr.splice(i,1)[0]);
        }
      }
    }
  }
  return arr;
}


export function sortSubtype(arr)
{
  for (var i = 1; i < arr.length; i++) 
  {
    if (arr[i].m_subtype < arr[0].m_subtype) 
    {
      //move current element to the first position
      arr.unshift(arr.splice(i,1)[0]);
    } 
    else if (arr[i].m_subtype > arr[i-1].m_subtype) 
    {
      //leave current element where it is
      continue;
    } 
    else {
      //find where element should go
      for (var j = 1; j < i; j++) {
        if (arr[i].m_subtype > arr[j-1].m_subtype && arr[i].m_subtype < arr[j].m_subtype) 
        {
          //move element
          arr.splice(j,0,arr.splice(i,1)[0]);
        }
      }
    }
  }
  return arr;
}


export function sortType(arr)
{
  for (var i = 1; i < arr.length; i++) 
  {
    if (arr[i].m_type < arr[0].m_type) 
    {
      //move current element to the first position
      arr.unshift(arr.splice(i,1)[0]);
    } 
    else if (arr[i].m_type > arr[i-1].m_type) 
    {
      //leave current element where it is
      continue;
    } 
    else {
      //find where element should go
      for (var j = 1; j < i; j++) {
        if (arr[i].m_type > arr[j-1].m_type && arr[i].m_type < arr[j].m_type) 
        {
          //move element
          arr.splice(j,0,arr.splice(i,1)[0]);
        }
      }
    }
  }
  return arr;
}


// if object is null, remove it from the list
export function sortObjectArrayByKey(arr, sortKey)
{
  arr = arr.filter( (data) => data!==null);
  for (var i = 1; i < arr.length; i++) 
  {
    if (arr[i][sortKey] < arr[0][sortKey]) 
    {
      //move current element to the first position
      arr.unshift(arr.splice(i,1)[0]);
    } 
    else if (arr[i][sortKey] > arr[i-1][sortKey]) 
    {
      //leave current element where it is
      continue;
    } 
    else {
      //find where element should go
      for (var j = 1; j < i; j++) {
        if (arr[i][sortKey] > arr[j-1][sortKey] && arr[i][sortKey] < arr[j][sortKey]) 
        {
          //move element
          arr.splice(j,0,arr.splice(i,1)[0]);
        }
      }
    }
  }
  return arr;
}


export function bubbleSort (list)  {
    var dummy = "";
    var counter=1;
    console.log(list);
    console.log( list.length!==0? list[0].item_code : "");
    for (var i=0 ; i<list.length-1; i++){
        console.log(list[i].item_code + " [vs] " + list[i+1].item_code + " [result] " + (list[i].item_code > list[i+1].item_code));
        if(list[i].item_code > list[i+1].item_code ) {
            dummy = list[i];
            list[i] = list[i+1];
            list[i+1] = dummy;
        }
        counter++;
        
    }
    console.log(counter);
    console.log(list);
    return list;
}
