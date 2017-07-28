import React from 'react';
import chat from "../components/chat"
import {getChat} from "../ecapi.js";

class DisplayChats extends React.Component{
    constructor(){
        super();
        this.state ={
            chats: [],
            isChatLoaded: false,
        }
        this.getChat();
    }
    async getChat(){
        try{
            const results = await getChat();
            const {chat} = results;
            console.log(results)
            this.setState({chats: chat});
            console.log("List of Objects ", this.state.chat);
            this.setState({isChatLoaded: true})

        } catch (error){
            console.log("Get chats didn't work" + error);
        }
    }

    componentDidMount(){
    }

    render(){
        console.log(this.state.isChatLoaded)
        if (this.state.isChatLoaded){
            console.log(this.state.chats)
            return this.state.chats.map((chats) => {
                return (
                    <h1>a</h1>
                )
            })
        }
        else{
            return (<p>Loading Chats</p>)
        }
    }
}



export default DisplayChats;
