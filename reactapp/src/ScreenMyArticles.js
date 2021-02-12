import React, {useState, useEffect} from 'react';
import './App.css';
import { Card, Icon, Modal} from 'antd';
import Nav from './Nav'

import {connect} from 'react-redux'

const { Meta } = Card;

function ScreenMyArticles(props) {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [wishlistArticle, setWishlistArticle] = useState([])



  useEffect(() => {
    const fetchWishlist = async() => {
      const data = await fetch('/get-wishlist', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `token=${props.token}`
       })
      const dataJSON = await data.json()
      console.log(dataJSON.wishlist)      
      setWishlistArticle([dataJSON.wishlist])
    }  
    fetchWishlist()
  }, [])

  var showModal = (title, content) => {
    setVisible(true)
    setTitle(title)
    setContent(content)
  }

  var handleOk = e => {
    console.log(e)
    setVisible(false)
  }

  var handleCancel = e => {
    console.log(e)
    setVisible(false)
  }

  try {
    var wishlistDisplay = wishlistArticle.map((article,i) => (
      <div key={i} style={{display:'flex',justifyContent:'center'}}>

        <Card
          
          style={{ 
          width: 300, 
          margin:'15px', 
          display:'flex',
          flexDirection: 'column',
          justifyContent:'space-between' }}
          cover={
          <img
              alt="example"
              src={article.image}
          />
          }
          actions={[
              <Icon type="read" key="ellipsis2" onClick={() => showModal(article.title,article.content)} />,
              <Icon type="delete" key="ellipsis" onClick={() => deleteArticle(article.id)} />
          ]}
          >

          <Meta
            title={article.title}
            description={article.description}
          />

        </Card>
        <Modal
          title={title}
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>{title}</p>
        </Modal>

      </div>

    ))
  }
  catch(error) {
    var wishlistDisplay = "Pas d'articles"
  }

  const deleteArticle = async(id) => {
    await(fetch('/delete-wishlist', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `token=${props.token}&articleID=${id}`
     })
    )
  }


  return (
    <div>
        <Nav/>
        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}} className="Banner">
          <img src='images/filter.png' style={{width:'40px', margin:'10px',cursor:'pointer'}} alt=''/>
        </div>
        <div className="Card">
              {wishlistDisplay}
        </div>
    </div>
  );
}

function mapStateToProps(state){
  return {
    myArticles: state.wishList,
    token: state.token
  }
}

function mapDispatchToProps(dispatch){
  return {
    deleteToWishList: function(articleTitle){
      dispatch({type: 'deleteArticle',
        title: articleTitle
      })
    }
  }
}



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenMyArticles);
