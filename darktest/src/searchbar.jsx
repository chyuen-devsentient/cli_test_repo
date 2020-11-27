import React, { useState, useContext, useEffect } from 'react'
// import { useHistory } from 'react-router-dom';
import { AutoComplete} from 'antd';
// import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { SearchContext, EmailMergeContext} from './App';
// import { gql } from "apollo-boost";
import { gql, useLazyQuery } from "@apollo/client";

const SEARCH_AUTHOR = gql`
  query ($id: String!){
    superAuthors (where: {
      displayName: {contains: $id}}
      first:8)
    {
      id
      displayEmail
      displayName
    }
  }
`;

// function capitalizeFirstLetter(string) {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }

function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  // Directly return the joined string
  return splitStr.join(' '); 
}

const SearchBar = ()=> {
  const [searchId, setSearchId] = useContext(SearchContext);
  const [emailMergeLoading, setEmailMergeLoading] = useContext(EmailMergeContext);
  const [searchItem, setSearchItem] = useState(null)
  const [dropDownOptions, setDropdownOptions] = useState([]);
  const [showValue, setShowValue] = useState(null)
  // const data = useContext(DataContext);

  // const history = useHistory();
  const [searchRemote, { data:remoteData }] = useLazyQuery(SEARCH_AUTHOR);
  
  // const renderTitle = (title) => {
  //   return (
  //     <span>
  //       {title}
  //       <a
  //         style={{
  //           float: 'right',
  //         }}
  //         href="https://www.google.com/search?q=antd"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         more
  //       </a>
  //     </span>
  //   );
  // };
  
  // const renderItem = (title, count) => {
  //   return {
  //     value: title,
  //     label: (
  //       <div
  //         style={{
  //           display: 'flex',
  //           justifyContent: 'space-between',
  //         }}
  //       >
  //         {title}
  //         {/* <span>
  //           <UserOutlined /> {count}
  //         </span> */}
  //       </div>
  //     ),
  //   };
  // };


  useEffect(()=>{
    // const authorDuplicated = data.superAuthors.map(item => item.displayName);
    // const authors = [...new Set(authorDuplicated.flat(1))]  

    // setDropdownOptions(authors)

    if (remoteData  && remoteData.superAuthors && remoteData.superAuthors.length>0) {
      const tempDropDown = remoteData.superAuthors.map(item=>item.displayName+ ' ' +item.displayEmail)
      // const tempDropDownWithEmail = remoteData.superAuthors.map(function (item) {
      //   return {
      //     'name': renderTitle(item.displayName),
      //     'email': renderItem(item.displayEmail)
      //   }}
      // )
      // const  tempDropDownUnique = Array.from(new Set(tempDropDown.map(x=>
      //   JSON.stringify(x))), x=>JSON.parse(x)) 
      setDropdownOptions(tempDropDown)
    }

  }, [remoteData])


  const onSelect = value => {
    // history.push("/userprofile");
    // setSearchItem(value);
    if (value.split(' ').length>0) {
    setSearchItem(value.split(' ').slice(-1)[0])
    }
    const tempSearchId = remoteData.superAuthors.filter(function (el) {
      return el.displayEmail === value.split(' ').slice(-1)[0]
    })

    if (tempSearchId && tempSearchId.length>0){
      setSearchId(tempSearchId[0].id)
    }

    // setRedirect(true)
    // return  <Redirect to="/dashboard/contributors" />
      };

  const onSubmit = () => {
    setSearchItem(null)
    setEmailMergeLoading(false)
    // history.push("/dashboard/contributors");
    // setRedirect(true)
    // return  <Redirect to="/dashboard/contributors" />
 }

    
  const onChange = value => {
    // if (showValue!==null) {
    //   setShowValue(value)
    // }
    // else {
    //   setShowValue(value)
    // }
    if (value==='' || value===' ' || value==undefined) {
      setShowValue('')
      setDropdownOptions('')
      searchRemote({ variables: { "id": "$$$$" } })
    } else {
      setShowValue(value)
      if (value !== undefined) {
        searchRemote({ variables: { "id": titleCase(value) } })
      }
    }
    
      // if (value!==undefined){
      //   if (value.length===0) {
      //     setDropdownOptions([])
      //     setSearchItem(null)
      // }
      // }
    };


  return(
    <div className="global-search-wrapper">
      <AutoComplete
        className="global-search"
        allowClear={true}
        autoFocus={true}
        backfill={false}
        size="large"
        dropdownMatchSelectWidth={600}
        style={{ width: '100%' }}
        // options={dropDownOptions}
        placeholder="Search DevSentient"
        optionLabelProp="value"
        value={showValue}
        dataSource={dropDownOptions}
        defaultActiveFirstOption={false}
        // filterOption={(inputValue, option) =>
        //   option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        // }
        filterOption ={true}
        onSelect={onSelect}
        onChange={onChange}
        // defaultActiveFirstOption={false}
        onSearch={onSubmit}
        defaultOpen={false}
        // defaultValue={showValue}
      >
        {/* <Input.Search 
          // allowClear 
          size="large" 
          onSearch={onSubmit}
          // suffix={<Icon type="search" className="certain-category-icon" />}  
        /> */}
      </AutoComplete>
      {/* {redirect?
        <Redirect to='/dashboard/contributors' />  : null
      } */}
    </div>
  )
}

export default SearchBar;