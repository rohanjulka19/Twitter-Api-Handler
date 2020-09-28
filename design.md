
a1 -> access Token 
a2 -> access Token



tweets = users.map((user)=>{
         return {
             "key" : user.accessToken ,
             tweets : <tweets>
        }

}


React Side 


result = [
    {
        token : t1 ,
        tweets : <tweets> 
    }
    {
        token : t2 ,
        tweets : <tweets>
    }
]

this.setState({
    tweets= this.result 
    ...
})

getColor(this.state.tweets[color_index]) 