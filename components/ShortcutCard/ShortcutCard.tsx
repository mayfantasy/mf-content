import Link from 'next/link'
import { Row, Modal, Input, Button } from 'antd'
import { useState } from 'react'
import { IShortcutForm } from '../../types/shortcut.type'
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons'
import TierWrapper from '../TierButton/TierButton'
import { tierMap } from '../../helpers/tier.helper'

interface IProps {
  id?: string
  title?: string
  url?: string
  isAdd?: boolean
  creating?: boolean
  deleting?: boolean
  createShortcut?: (form: IShortcutForm) => void
  deleteShortcut?: (id: string) => void
}

const ShortcutCard = (props: IProps) => {
  const {
    id,
    title,
    url,
    isAdd,
    createShortcut,
    deleteShortcut,
    creating,
    deleting
  } = props
  const [modalOpen, setModalOpen] = useState(false)

  const [form, setForm] = useState<IShortcutForm>({
    title: title || '',
    url: url || ''
  })
  const onChange = (n: string, v: string) => {
    setForm({
      ...form,
      [n]: v
    })
  }

  return (
    <div>
      <style jsx>
        {`
          .shortcut--general {
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: white;
            padding: 8px;
            height: 200px;
            width: 200px;
            cursor: pointer;
            color: #aaa;
            text-align: center;
            &:hover {
              border: 1px solid #aaa;
            }
          }
          .shortcut-card {
            margin-right: 15px;
            margin-bottom: 15px;
            &:hover {
              .title {
                text-decoration: underline;
              }
            }
            .title {
              font-size: 1.1rem;
            }
            position: relative;
            .delete-button {
              display: none;
              position: absolute;
              bottom: 5px;
              left: 5px;
              color: red;
            }
            &:hover {
              .delete-button {
                display: initial;
              }
            }
          }
          .helper-text {
            margin-top: 3px;
            color: grey;
            font-size: 0.7rem;
          }
        `}
      </style>
      {!isAdd && title && url ? (
        <div className="shortcut-card shortcut--general">
          <Link href={url}>
            <a target="_blank">
              <Row
                style={{ width: '100%', height: '100%' }}
                justify="center"
                align="middle"
              >
                <div className="title">{title}</div>
              </Row>
            </a>
          </Link>
          {deleteShortcut && !deleting && (
            <TierWrapper tier={tierMap.DELETE_SHORTCUT.tier}>
              <div
                className="delete-button"
                onClick={() => {
                  if (id) {
                    deleteShortcut(id)
                  }
                }}
              >
                <CloseCircleOutlined style={{ color: 'red' }} />
              </div>
            </TierWrapper>
          )}
        </div>
      ) : (
        <div className="shortcut--general" onClick={() => setModalOpen(true)}>
          <Row
            style={{ width: '100%', height: '100%' }}
            justify="center"
            align="middle"
          >
            <PlusOutlined style={{ fontSize: '2rem' }} />
          </Row>
        </div>
      )}
      <Modal
        title="Create Shortcut"
        okButtonProps={{
          disabled: creating
        }}
        okText={creating ? 'Creating...' : 'Create'}
        onOk={() => {
          if (createShortcut) {
            createShortcut(form)
          }
        }}
        visible={modalOpen}
        closable={true}
        onCancel={() => {
          setModalOpen(false)
          Modal.destroyAll()
        }}
      >
        <div>
          <div>
            <h4>Title</h4>
            <Input
              value={form.title}
              onChange={(e) => onChange('title', e.target.value)}
            />
            <div className="helper-text">Exp: "Theme Settings"</div>
          </div>
          <br />
          <div>
            <h4>URL</h4>
            <Input
              value={form.url}
              onChange={(e) => onChange('url', e.target.value)}
            />
            <div className="helper-text">
              Exp: "https://cms.monfent.com/schema/detail?id=254956706394538516"
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ShortcutCard
