import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import { AxiosError } from 'axios'
import Loading from '../../components/Loading/Loading'
import { Alert, Table, Button } from 'antd'
import { RequestStatus } from '../../helpers/request'
import {
  getAccessKeyListRequest,
  deleteAccessKeyRequest
} from '../../requests/access-key.request'
import { pageRoutes } from '../../navigation/page-routes'

const AccessKeyListPage = () => {
  const accessKeyRequestStatus = new RequestStatus()
  const [accessKeyStatus, setAccessKeyStatus] = useState(
    accessKeyRequestStatus.status
  )
  const deleteAccessKeyRequestStatus = new RequestStatus()
  const [deleteAccessKeyStatus, setDeleteAccessKeyStatus] = useState(
    accessKeyRequestStatus.status
  )
  const [accessKeys, setAccessKeys] = useState([])

  /**
   * Get Access Key List
   */
  const getAccessKeyList = () => {
    setAccessKeyStatus(accessKeyRequestStatus.loading())
    getAccessKeyListRequest()
      .then((res) => {
        setAccessKeyStatus(accessKeyRequestStatus.success())
        setAccessKeys(res.data.result)
      })
      .catch((err: AxiosError) => {
        setAccessKeyStatus(accessKeyRequestStatus.error(err))
      })
  }

  /**
   *
   * @param id
   * Delete Access Key
   */
  const deleteAccessKey = (id: string) => {
    setDeleteAccessKeyStatus(deleteAccessKeyRequestStatus.loading())
    deleteAccessKeyRequest(id)
      .then((res) => {
        setDeleteAccessKeyStatus(deleteAccessKeyRequestStatus.success())
        getAccessKeyList()
      })
      .catch((err: AxiosError) => {
        setDeleteAccessKeyStatus(deleteAccessKeyRequestStatus.error(err))
      })
  }

  useEffect(() => {
    getAccessKeyList()
  }, [])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key'
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'action',
      render: (id: string) => (
        <div>
          <Button
            type="danger"
            disabled={deleteAccessKeyStatus.loading || true}
            onClick={() => deleteAccessKey(id)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ]

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'access-key',
          name: 'Access Key'
        },
        {
          key: 'list',
          url: pageRoutes.listAccessKeys,
          name: 'List'
        }
      ]}
    >
      {accessKeyStatus.error && (
        <Alert message={accessKeyStatus.error} type="error" closable />
      )}
      {deleteAccessKeyStatus.error && (
        <Alert message={deleteAccessKeyStatus.error} type="error" closable />
      )}
      <br />
      <div>
        {accessKeyStatus.loading || deleteAccessKeyStatus.loading ? (
          <Loading />
        ) : (
          <Table pagination={false} dataSource={accessKeys} columns={columns} />
        )}
      </div>
    </PageLayout>
  )
}

export default AccessKeyListPage
