import 'antd/dist/antd.css';

import { Skeleton, Row, Col, Tooltip, Popconfirm, message, Tag, Table, Space, Input, notification, Spin, Card } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import React, { useState, useEffect, useRef , useContext} from 'react'

import { UserSwitchOutlined } from '@ant-design/icons';
import { gql } from "@apollo/client";
import { useQuery, useMutation } from '@apollo/react-hooks';
import { EmailMergeContext} from '../App';
import { codeSurvivalStats_placeholder } from './data';


const SEARCH_EMAIL_MERGE = gql`
query Query($superAuthorWhere: SuperAuthorWhereUniqueInput!) {
  superAuthor(where: $superAuthorWhere) {
    id
    displayEmail
    displayName
    authors {
      name
      email
      id
      parentRepo {
        remoteUrl
      }
      emailMergeSuggestions {
        status
        id
        author {
          email
          id
          name
        }
        suggestedsuperAuthor {
          displayEmail
          displayName
        }     
      }   
    }
  }
}
`;


const MUTATE_REQUEST_MERGE = gql`
  mutation RequestAuthorMergeMutation($requestAuthorMergeMergeId: String) {
    requestAuthorMerge(mergeId: $requestAuthorMergeMergeId)
  }
`;

const MUTATE_CONFIRM_MERGE = gql`
  mutation VerifyAuthorMergeMutation($verifyAuthorMergeMergeId: String, $verifyAuthorMergeUserVerificationCode: String) {
    verifyAuthorMerge(mergeId: $verifyAuthorMergeMergeId, userVerificationCode: $verifyAuthorMergeUserVerificationCode)
  }
`;

const MUTATE_CANCEL_MERGE = gql`
  mutation CancelAuthorMergeMutation($cancelAuthorMergeMergeId: String) {
    cancelAuthorMerge(mergeId: $cancelAuthorMergeMergeId)
  }
`;

const MUTATE_REJECT_MERGE = gql`
  mutation RejectAuthorMergeMutation($rejectAuthorMergeMergeId: String) {
    rejectAuthorMerge(mergeId: $rejectAuthorMergeMergeId)
  }
`;

const openNotificationWithIcon = (type, title, message) => {
  notification[type]({
    message: title,
    description: message
  });
};


function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => ++value); // update the state to force render
}


const AliasComponent = (props)=> {
  const [emailMergeLoading, setEmailMergeLoading] = useContext(EmailMergeContext);
  const [emails, setEmails] = useState(props.emails)
  const [mergeSuggestions, setMergeSuggestions] = useState([]);
  const clickRef = useRef(null);

  useEffect(()=>{
    setEmails(props.emails)
  },[props] )


  const confirmMergeClick = (mergeId) => {
    console.log("clickRef", clickRef);
    const verificationCode = clickRef.current.state.value;
    console.log("verificationCode", verificationCode);
    confirmMerge({
      variables: {
        "verifyAuthorMergeMergeId": mergeId,
        "verifyAuthorMergeUserVerificationCode": verificationCode
      }
    });
  }

  const cancelMergeClick = mergeId => {
    cancelMerge({
      variables: {
        "cancelAuthorMergeMergeId": mergeId
      }
    });
  }

  const cancelRejectClick = mergeId => {
    cancelReject({
      variables: {
        "cancelAuthorMergeMergeId": mergeId
      }
    });
  }

  const rejectMergeClick = mergeId => {
    rejectMerge({
      variables: {
        "rejectAuthorMergeMergeId": mergeId
      }
    });
  }

  function confirm(e) {
    requestMerge({
      variables: {
        "requestAuthorMergeMergeId": e
      }
    });
    // message.success('Hooray! Thanks for confirming!');
  }
  

  const { data: dataEmails, loading: loadingEmails, error: emailsError, refetch: emailsRefetch } = useQuery(
    SEARCH_EMAIL_MERGE,  {
      variables: {
        "superAuthorWhere": {
          "id": props.ids
        }
      },
    });

  const [requestMerge, { requestMergeData } ] = useMutation(MUTATE_REQUEST_MERGE, {
    onCompleted: data => {
      console.log("MUTATE_REQUEST_MERGE", data);
      openNotificationWithIcon('success', "Email Verification", 
        "We've sent you an email with a verification code. Please check and come back to complete the process.");  
      emailsRefetch();
    },
    onError: error => {
      console.log("MUTATE_REQUEST_MERGE error", error);
      openNotificationWithIcon('error', "Email Verification Failed", 
        "We are having trouble sending out a verification email. Please contact support@devsentient.com for help.");  
      emailsRefetch();
    }
  });
  const [confirmMerge, { confirmMergeData } ] = useMutation(MUTATE_CONFIRM_MERGE, {
    onCompleted: data => {
      console.log("MUTATE_CONFIRM_MERGE", data);
      openNotificationWithIcon('success', "Merge Confirmed", 
        "Thank you for providing the code. We've successfully merged the accounts.");  
      emailsRefetch();
    },
    onError: error => {
      console.log("MUTATE_CONFIRM_MERGE error", error);
      openNotificationWithIcon('error', "Merge Confirmation Error", 
        "We couldn't confirm the verification code. If you're sure that it was entered correctly, please contact support@devsentient.com");  
      emailsRefetch();
    }
  });

  const [cancelMerge, { cancelMergeData } ] = useMutation(MUTATE_CANCEL_MERGE, {
    onCompleted: data => {
      console.log("MUTATE_CANCEL_MERGE", data);
      openNotificationWithIcon('success', "Merge Cancelled", 
        "We've cancelled your profile merge request.");  
      emailsRefetch();
    },
    onError: error => {
      console.log("MUTATE_CANCEL_MERGE error", error);
      openNotificationWithIcon('error', "Merge Cancellation Error", 
        "We couldn't cancel the merge request. Please contact support@devsentient.com");  
      emailsRefetch();
    }
  });

  const [cancelReject, { cancelRejectData } ] = useMutation(MUTATE_CANCEL_MERGE, {
    onCompleted: data => {
      console.log("MUTATE_CANCEL_MERGE", data);
      openNotificationWithIcon('success', "Enabling Suggestion", 
        "We've re-enabled the merge suggestion. You can proceed to merge the profiles.");  
      emailsRefetch();
    },
    onError: error => {
      console.log("MUTATE_CANCEL_MERGE error", error);
      openNotificationWithIcon('error', "Enabling Suggestion Error", 
        "We couldn't re-enable the profile merge suggestion. Please contact support@devsentient.com");  
      emailsRefetch();
    }
  });

  const [rejectMerge, { rejectMergeData } ] = useMutation(MUTATE_REJECT_MERGE, {
    onCompleted: data => {
      console.log("MUTATE_REJECT_MERGE", data);
      openNotificationWithIcon('success', "Confirmed Merge Rejection", 
        "Thanks! We've marked this profile as not belonging to you.");  
      emailsRefetch();
    },
    onError: error => {
      console.log("MUTATE_REJECT_MERGE error", error);
      openNotificationWithIcon('error', "Merge Rejection Error", 
        "We couldn't reject the merge proposal. Please contact support@devsentient.com");  
      emailsRefetch();
    }
  });


  if (emailsError) {
    console.log("Query error: ", emailsError);
  }
  useEffect(()=>{
    if (dataEmails  && dataEmails.superAuthor ) {
      console.log("dataEmails", dataEmails);
      const suggestions = dataEmails.superAuthor.authors.reduce((res, author) => {
        console.log("dataEmails.superAuthor", author);
        res.push(...author.emailMergeSuggestions.map(item => ({
          'mergeId': item.id,
          'name': item.suggestedsuperAuthor.displayName,
          'email': item.suggestedsuperAuthor.displayEmail,
          'status': item.status,
          'remoteUrl': author.parentRepo.remoteUrl,
          'actions': "merge"
        })));
        return res;
      }, []);
      console.log("suggestions", suggestions);
      const dedupedSuggestions = [...new Set(suggestions)];
      console.log("dedupedSuggestions", dedupedSuggestions);
      setMergeSuggestions(dedupedSuggestions);
    }
  }, [dataEmails])

  const statusTooltips = {
    'unconfirmed': "We think this identity might be you.\nPlease confirm or reject through the actions menu."
  }

  const tableColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    }, 
    {
      title: "Email",
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: text => (
        <Tooltip title={statusTooltips[text]}>
          <Tag>{text}</Tag>
          { 
            (text === "confirmed") && 
            <Tooltip title="We're processing your repos to update your profile with the merged account">
              <Spin size="small" />
            </Tooltip>
          }
        </Tooltip>
      )
    },
    {
      title: "Repo URL",
      dataIndex: 'remoteUrl',
      key: 'remoteUrl',
      render: text => <a href={text}>{text}</a>
    },
    {
      title: "Actions",
      dataIndex: 'status',
      key: 'actions',
      render: (text, record) => {
        console.log(`actions ${text}`);
        if (text === "unconfirmed") {
          return (
            <span>
              <Space>
                <Tooltip title="Merge into my profile">
                  <a href="#" onClick={() => confirm(record.mergeId)} ><CheckCircleTwoTone /></a>
                </Tooltip>
                <Tooltip title="Not my e-mail">
                  <a href="#" onClick={() => rejectMergeClick(record.mergeId)} ><CloseCircleTwoTone /></a>
                </Tooltip>
              </Space>
            </span>
          )
        }

        if (text === "pending") {
          return (
            <span>
              <Space>
                <Input ref={clickRef} placeholder="Enter verification code" />
                <Tooltip title="Submit verification code">
                  <a href="#" onClick={() => confirmMergeClick(record.mergeId)} ><CheckCircleTwoTone /></a>
                </Tooltip>
                <Tooltip title="Cancel this profile merge request">
                  <a onClick={() => cancelMergeClick(record.mergeId)} href="#"><CloseCircleTwoTone /></a>
                </Tooltip>
              </Space>
            </span>
          )
        }

        if (text === "rejected") {
          return (
            <span>
              <Space>
                <Tooltip title="Revert back to queue. Rejected by mistake.">
                  <a onClick={() => cancelRejectClick(record.mergeId)} href="#"><CloseCircleTwoTone /></a>
                </Tooltip>
              </Space>
            </span>
          )
        }

        if (text === "confirmed") {
          return (
            <span>
              <Space>
                <Tooltip title="Revert back to queue. Confirmed by mistake.">
                  <a onClick={() => cancelMergeClick(record.mergeId)} href="#"><CloseCircleTwoTone /></a>
                </Tooltip>
              </Space>
            </span>
          )
        }
      }
    }
  ];

  // useEffect(()=>{
  //   setEmails(emails)
  // },[emails, mergeEmails])

    return (
      <div>
        <Row>
          <Col span="24">
            <Card
              height={250} 
              title={
                <div>
                  <UserSwitchOutlined />
                  <Tooltip title="Click on the emails below to merge it into your account">
                    <span> Emails </span>
                  </Tooltip>
                </div>}
              bordered={false} 
              style={styles.topMargin}                                 
              >
              <Skeleton loading={loadingEmails} active>
                <Table dataSource={mergeSuggestions} columns={tableColumns} locale={{emptyText: "No author merge suggestions"}}/>
              </Skeleton>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  const styles = {
    siteCardBorderLessWrapper: {
      paddingLeft: '16px', 
      paddingRight: '16px'
    },
    topMargin: { marginTop: 16 },
    cardBackground: { background: '#cfcfcf' },
    cardTitleBackground: { background: '#ececec' },
    contentCard: {paddingLeft: '16px', paddingRight: '16px'}
  };

export default AliasComponent;