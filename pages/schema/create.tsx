import React, { useState, useEffect } from 'react'
import PageLayout from '../../components/PageLayout/PageLayout'
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Checkbox,
  Button,
  Row,
  Alert,
  Col,
  Card,
  Select,
  InputNumber,
  DatePicker,
  Spin
} from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { createAccountRequest } from '../../requests/account.request'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import Loading from '../../components/Loading/Loading'
import { setToken, setUser } from '../../helpers/auth.helper'
import router from 'next/router'
import {
  ICreateSchemaPayload,
  ESchemaFieldType,
  ISchemaFieldDef,
  ISchemaFieldDefKeys,
  ICreateSchemaFormValues
} from '../../types/schema.type'
import { createSchemaRequest } from '../../requests/schema.request'
import { AxiosError } from 'axios'
import { enumToKeyArray } from '../../helpers/utils.helper'
import Moment from 'moment'
import { string } from 'prop-types'
import { getCollectionListRequest } from '../../requests/collection.request'
import { ICollection } from '../../types/collection.type'
import FormFieldLabel from '../../components/FormFieldLabel/FormFieldLabel'
import FormItems from '../../components/shema/FormItems'
import { addField, removeField } from '../../helpers/schema/form'
import { RequestStatus } from '../../helpers/request'
import SchemaForm from '../../components/shema/Form'

interface ICreateSchemaFormProps<V> {
  handleSubmit: (e: any) => void
  form: WrappedFormUtils<V>
}

const CreateSchemaForm = (
  props: ICreateSchemaFormProps<ICreateSchemaFormValues>
) => {
  const { form, handleSubmit } = props
  const { getFieldDecorator } = form

  /** Intialize empty _defKeys */
  getFieldDecorator('_defKeys', {
    initialValue: [] as ISchemaFieldDefKeys[]
  })

  return <SchemaForm form={form} handleSubmit={handleSubmit} />
}

interface IProps extends FormComponentProps<ICreateSchemaFormValues> {}

const CreateSchemaPage = (props: IProps) => {
  const schemaRequestStatus = new RequestStatus()
  const [schemaStatus, setSchemaStatus] = useState(schemaRequestStatus.status)
  const { form } = props

  const createSchema = (
    values: ICreateSchemaFormValues,
    defs: ISchemaFieldDef[]
  ) => {
    // Create schema
    setSchemaStatus(schemaRequestStatus.setLoadingStatus())
    createSchemaRequest({
      name: values.name,
      handle: values.handle,
      description: values.description,
      def: defs as ISchemaFieldDef[],
      collection_id: values.collection_id
    })
      .then((res) => {
        setSchemaStatus(schemaRequestStatus.setSuccessStatus())

        router.push('/schema/list')
      })
      .catch((err: AxiosError) => {
        setSchemaStatus(schemaRequestStatus.setErrorStatus(err))
      })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { _defKeys, _defValues } = values
        const defs = (_defKeys as ISchemaFieldDefKeys[]).map((def) => {
          const obj = {} as { [key: string]: any }

          Object.keys(def).forEach((key) => {
            obj[key] = _defValues[(def as any)[key]]
          })
          return obj
        })

        // Create schema
        createSchema(values, defs as ISchemaFieldDef[])
      }
    })
  }

  return (
    <PageLayout
      breadCrumb={[
        {
          key: 'schema',
          url: '/schema/list',
          name: 'Schema'
        },
        {
          key: 'create',
          url: '/schema/create',
          name: 'Create'
        }
      ]}
    >
      {schemaStatus.error && (
        <Alert message={schemaStatus.error} type="error" closable />
      )}
      <br />
      <div style={{ height: '70%' }}>
        {schemaStatus.loading ? (
          <Loading />
        ) : schemaStatus.success ? (
          <div style={{ color: 'green' }}>Schema created successfully.</div>
        ) : (
          <div style={{ width: '70%' }}>
            <CreateSchemaForm form={form} handleSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </PageLayout>
  )
}

const WrappedSchemaPage = Form.create({ name: 'create-schema' })(
  CreateSchemaPage
)

export default WrappedSchemaPage
