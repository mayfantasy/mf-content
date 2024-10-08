import { RequestStatus } from '../../helpers/request'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Moment from 'moment'
import {
  IUserWithoutPassword,
  IUpdateUserInfoPayload,
  IUserSchemaMetaItem
} from '../../types/user.type'
import {
  getUserByIdRequest,
  updateUserByIdRequest,
  deleteUserRequest
} from '../../requests/user.request'
import PageLayout from '../../components/PageLayout/PageLayout'
import { pageRoutes } from '../../navigation/page-routes'
import {
  Alert,
  Button,
  Descriptions,
  Row,
  Col,
  Input,
  DatePicker,
  Popconfirm
} from 'antd'
import Loading from '../../components/Loading/Loading'
import PageHeader from '../../components/PageHeader/PageHeader'
import FormFieldLabel from '../../components/FormFieldLabel/FormFieldLabel'
import UserSchemaMeta from '../../components/UserSchemaMeta/UserSchemaMeta'
import ImageUploader from '../../components/ImageUploader/ImageUploader'
import { AxiosError } from 'axios'
import { QuestionCircleOutlined } from '@ant-design/icons'
import Link from 'next/link'
import TierWrapper from '../../components/TierButton/TierButton'
import { tierMap } from '../../helpers/tier.helper'

const UserUpdatePage = () => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    date_of_birth: '',
    phone: '',
    profile_img: ''
  })

  /** User Request */
  const getReq = new RequestStatus()
  const updateReq = new RequestStatus()

  const [getUserStatus, setGetUserStatus] = useState(getReq.status)
  const [updateUserStatus, setUpdateUserStatus] = useState(updateReq.status)

  const [user, setUser] = useState<IUserWithoutPassword | null>(null)
  const router = useRouter()

  /** Get User */
  const getUser = (id: string) => {
    setGetUserStatus(getReq.loading())
    getUserByIdRequest(id)
      .then((res) => {
        const u = res.data.result as IUserWithoutPassword
        setGetUserStatus(getReq.success())
        setUser(u)
        setForm({
          email: u.email,
          first_name: u.first_name,
          last_name: u.last_name,
          username: u.username,
          date_of_birth: u.date_of_birth,
          phone: u.phone,
          profile_img: u.profile_img
        })
      })
      .catch((err) => {
        setGetUserStatus(getReq.error(err))
      })
  }

  /** Update User */
  const updateUser = (id: string) => {
    setUpdateUserStatus(updateReq.loading())
    updateUserByIdRequest({
      id,
      ...form
    } as IUpdateUserInfoPayload)
      .then(() => {
        setUpdateUserStatus(updateReq.success())
        getUser(id)
      })
      .catch((err) => {
        setUpdateUserStatus(updateReq.error(err))
      })
  }

  useEffect(() => {
    const id = router.query.id
    if (id) {
      getUser(id as string)
    }
  }, [router.query])

  /**
   * ||=================
   * || Delete user
   */
  const deleteUserRequestStatus = new RequestStatus()
  const [deleteUserStatus, setDeleteUserStatus] = useState(
    deleteUserRequestStatus.status
  )

  const deleteUser = (id: string) => {
    setDeleteUserStatus(deleteUserRequestStatus.loading())
    deleteUserRequest(id)
      .then((res) => {
        setDeleteUserStatus(deleteUserRequestStatus.success())
        router.push(pageRoutes.listUsers)
      })
      .catch((err: AxiosError) => {
        setDeleteUserStatus(deleteUserRequestStatus.error(err))
      })
  }

  /**
   * Set content
   */
  let content = <></>
  const layout = (c: React.ReactNode) => (
    <PageLayout
      breadCrumb={[
        {
          key: 'user',
          url: pageRoutes.listUsers,
          name: 'User'
        },
        {
          key: 'update',
          name: 'Update'
        }
      ]}
    >
      <div>{c}</div>
    </PageLayout>
  )

  if (getUserStatus.error) {
    content = <Alert message={getUserStatus.error} type="error" closable />
    return layout(content)
  }

  if (getUserStatus.loading) {
    content = <Loading />
    return layout(content)
  }

  /**
   * If user is not found, show load user button
   */
  if (!user) {
    content = (
      <Button onClick={() => getUser(router.query.id as string)}>Load</Button>
    )
    return layout(content)
  } else {
    const userWithoutMeta = { ...user }
    delete userWithoutMeta.meta
    const meta = user.meta
    content = (
      <div className="w-max-800 ">
        {updateUserStatus.error && (
          <>
            <Alert message={updateUserStatus.error} type="error" closable />
            <br />
          </>
        )}
        {updateUserStatus.success && (
          <>
            <Alert
              message="User updated successfully"
              type="success"
              closable
            />
            <br />
          </>
        )}
        <PageHeader
          name={`${user.last_name} ${user.first_name}`}
          description={`${user.email}, ${user.phone}`}
          buttons={
            <>
              <Link href={pageRoutes.listUsers}>
                <Button>Back to list</Button>
              </Link>
            </>
          }
        />
        <br />
        <div>
          <div>
            <Row>
              <Col span={24}>
                <FormFieldLabel>Profile Image</FormFieldLabel>
                <div>
                  <ImageUploader
                    width="200px"
                    value={form.profile_img}
                    onChange={(image: string) => {
                      setForm({
                        ...form,
                        profile_img: image
                      })
                    }}
                  />
                </div>
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={12}>
                <FormFieldLabel>Email</FormFieldLabel>
                <Input
                  value={form.email}
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      email: e.target.value
                    })
                  }
                />
              </Col>
              <Col span={12}>
                <FormFieldLabel>Username</FormFieldLabel>
                <Input
                  value={form.username}
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      username: e.target.value
                    })
                  }
                />
              </Col>
            </Row>
            <br />
            <Row gutter={2}>
              <Col span={12}>
                <FormFieldLabel>First Name</FormFieldLabel>
                <Input
                  value={form.first_name}
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      first_name: e.target.value
                    })
                  }
                />
              </Col>
              <Col span={12}>
                <FormFieldLabel>Last Name</FormFieldLabel>
                <Input
                  value={form.last_name}
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      last_name: e.target.value
                    })
                  }
                />
              </Col>
            </Row>
            <br />
            <Row gutter={2}>
              <Col span={12}>
                <FormFieldLabel>Date of Birth</FormFieldLabel>
                <DatePicker
                  style={{ width: '100%' }}
                  value={Moment(form.date_of_birth)}
                  onChange={(d: Moment.Moment | null) => {
                    if (d && d.format) {
                      setForm({
                        ...form,
                        date_of_birth: d.format()
                      })
                    }
                  }}
                />
                {/* <Input
                  value={form.date_of_birth}
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      date_of_birth: e.target.value
                    })
                  }
                /> */}
              </Col>
              <Col span={12}>
                <FormFieldLabel>Phone</FormFieldLabel>
                <Input
                  value={form.phone}
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      phone: e.target.value
                    })
                  }
                />
              </Col>
            </Row>
          </div>
        </div>
        <br />
        {
          <>
            {meta &&
              Object.keys(meta).length &&
              Object.keys(meta).map((key: any) => {
                if (
                  typeof meta[key] === 'object' &&
                  meta[key].length &&
                  meta[key].every(
                    (o: any) => o.schema_handle && o.collection_handle && o.id
                  )
                ) {
                  const schemaHandle = meta[key][0].schema_handle
                  const collectionHandle = meta[key][0].collection_handle
                  const objectIds = meta[key].map(
                    (item: IUserSchemaMetaItem) => item.id
                  )
                  return (
                    <>
                      <UserSchemaMeta
                        key={key}
                        collectionHandle={collectionHandle}
                        schemaHandle={schemaHandle}
                        objectIds={objectIds}
                      />
                      <br />
                    </>
                  )
                } else {
                  return (
                    <>
                      <Descriptions layout="vertical" bordered size="small">
                        <Descriptions.Item
                          label={
                            <div>
                              <FormFieldLabel>{key}</FormFieldLabel>
                            </div>
                          }
                          key={key}
                        >
                          <code>
                            <pre>
                              <small>
                                {JSON.stringify((meta as any)[key], null, ' ')}
                              </small>
                            </pre>
                          </code>
                        </Descriptions.Item>
                      </Descriptions>
                      <br />
                    </>
                  )
                }
              })}
          </>
        }
        <br />
        <Row justify="space-between">
          <Button
            loading={updateUserStatus.loading}
            type="primary"
            onClick={() => updateUser(router.query.id as string)}
          >
            Submit
          </Button>
          <TierWrapper tier={tierMap.DELETE_USER.tier}>
            <Popconfirm
              title="Are you sure？"
              onConfirm={() => deleteUser(router.query.id as string)}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              <Button type="primary" danger>
                Delete
              </Button>
            </Popconfirm>
          </TierWrapper>
        </Row>
      </div>
    )
    return layout(content)
  }
}

export default UserUpdatePage
