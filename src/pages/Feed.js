import React, { Component } from "react";
import "./Feed.css";
import api from "../services/api";
import io from "socket.io-client";

import more from "../assets/more.svg";
import like from "../assets/like.svg";
import comment from "../assets/comment.svg";
import send from "../assets/send.svg";
//import post from 'post';

class Feed extends Component {
  state = {
    feed: []
  };
  async componentDidMount() {       //monta o componente assim que ele é criado ou alterado
    this.registerToSocket();        //chama a função que aciona o socket
    const response = await api.get("posts");

    this.setState({ feed: response.data });
  }
  registerToSocket = () => {        //função que define a sincronização em tempo real    
    const socket = io("http://localhost:3333");
    socket.on("post", newPost => {
      this.setState({
        feed: [newPost, ...this.state.feed]  //cria um novo feed alocando no inicio da lista e repetindo os demais
      });
    });
    socket.on("like", likedPost => {
        this.setState({
          feed: this.state.feed.map(post =>
            post._id === likedPost._id ? likedPost : post
          )
        });
    });
  };
  handleLike = id => {
    api.post(`/posts/${id}/like`);    //metodo para possibilitar a manipulação dos likes
  };
  render() {
    return (
      <section id="post-list">
        {this.state.feed.map(post => (
          <article key={post._id}>
            <header>
              <div className="user-info">
                <span> {post.author} </span>
                <span className="place"> {post.place} </span>
              </div>
              <img src={more} alt="mais" />
            </header>
            <img src={`http://localhost:3333/files/${post.image}`} />
            <footer>
              <div className="actions">
                <button type="button" onClick={() => this.handleLike(post._id)}>  
                  <img src={like} alt="" />
                </button>
                <img src={comment} alt="" />
                <img src={send} alt="" />
              </div>
              <strong>{post.likes} curtidas </strong>
              <p>
                {post.description}
                <span> {post.hastags} </span>
              </p>
            </footer>
          </article>
        ))}
      </section>
    );
  }
}

export default Feed;
