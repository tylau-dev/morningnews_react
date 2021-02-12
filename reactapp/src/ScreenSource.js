import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import './App.css';
import { List, Avatar} from 'antd';
import Nav from './Nav'
import { connect } from 'react-redux';

function ScreenSource(props) {

  const [sourceList, setSourceList] = useState([])
  const [selectedLang, setSelectedLang] = useState(props.selectedLang)
  const languageList = ['fr', 'en']

  useEffect(() => {
    const APIResultsLoading = async() => {
      var langue = 'fr'
      var country = 'fr'
        
      if(selectedLang == 'en'){
        var langue = 'en'
        var country = 'us'
      }
      props.changeLang(selectedLang)
      const data = await fetch(`https://newsapi.org/v2/sources?language=${langue}&country=${country}&apiKey=9980424ff4484813ba7be1fb86a454bf`)
      const body = await data.json()
      setSourceList(body.sources)
    }

    const updateLanguageDB = async() => {
      const data_lang = await fetch(
        '/set-language', {
          method: 'PUT',
          headers: {'Content-Type':'application/x-www-form-urlencoded'},
          body: `token=${props.token}&language=${selectedLang}`
          });
      const body_lang = await data_lang.json()
      console.log(body_lang)
    }

    APIResultsLoading()
    updateLanguageDB()
  }, [selectedLang])

  
  return (
    <div>
        <Nav/>
       
       <div style={{display:'flex', justifyContent:'center', alignItems:'center'}} className="Banner">
        {
          languageList.map((lang, index) => {
            if (lang === 'en') {
              var countryImg = '/images/uk.png'
            }
            else {var countryImg = `/images/${lang}.png`}

            if (lang === selectedLang) {
              return(<img style={{width:'40px', margin:'10px',cursor:'pointer', border: '1px solid #FBF2D4'}} src={countryImg} onClick={() => setSelectedLang(lang)} />)
            }
            else {
              return(<img style={{width:'40px', margin:'10px',cursor:'pointer'}} src={countryImg} onClick={() => setSelectedLang(lang)} />)

            }
          })
        }

        </div>

       <div className="HomeThemes">
          
              <List
                  itemLayout="horizontal"
                  dataSource={sourceList}
                  renderItem={source => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={`/images/${source.category}.png`} />}
                        title={<Link to={`/screenarticlesbysource/${source.id}`}>{source.name}</Link>}
                        description={source.description}
                      />
                    </List.Item>
                  )}
                />


          </div>
                 
      </div>
  );
}

function mapStateToProps(state){
  return {selectedLang: state.selectedLang, token: state.token}
}

function mapDispatchToProps(dispatch){
  return {
    changeLang: function(selectedLang){
      dispatch({type: 'changeLang', selectedLang: selectedLang})
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenSource)
