import { RequestStatus } from '../../helpers/request'
import { useState, useEffect, useRef } from 'react'
import {
  getAccountImagesRequest,
  deleteAccountImageRequest
} from '../../requests/storage.request'
import { Row, Col, Button, Modal, Alert, Popconfirm } from 'antd'
import Link from 'next/link'
import Loading from '../Loading/Loading'
import { IImageListEntry } from '../../types/storage.type'
import { color } from '../../helpers/color.helper'
import { QuestionCircleOutlined, CheckCircleTwoTone } from '@ant-design/icons'
import TierWrapper from '../TierButton/TierButton'
import { tierMap } from '../../helpers/tier.helper'
import { isPdf } from '../../helpers/utils.helper'

interface IProps {
  onSelect: (img: IImageListEntry) => void
  open: boolean
  onToggle: (open: boolean) => void
}

const StorageImagesSelector = (props: IProps) => {
  const { onSelect, open, onToggle } = props

  // OnSelect
  const [activeImage, setActiveImage] = useState<IImageListEntry | null>(null)

  // Get account images
  const listReq = new RequestStatus()
  const [listStatus, setListStatus] = useState(listReq.status)
  const [images, setImages] = useState<IImageListEntry[]>([])

  const getAccountImagegs = () => {
    setListStatus(listReq.loading())
    getAccountImagesRequest()
      .then((res) => {
        const images = res.data.result
        setImages(images)
        setListStatus(listReq.success())
      })
      .catch((err) => {
        setListStatus(listReq.error(err))
      })
  }

  // delete account image
  const delReq = new RequestStatus()
  const [delStatus, setDelStatus] = useState(listReq.status)

  const deleteAccountImage = (filename: string) => {
    setDelStatus(delReq.loading())
    deleteAccountImageRequest(filename)
      .then((res) => {
        setDelStatus(delReq.success())
        getAccountImagegs()
      })
      .catch((err) => {
        setDelStatus(delReq.error(err))
      })
  }

  useEffect(() => {
    if (open) {
      getAccountImagegs()
    }
  }, [open])

  const onOk = () => {
    onSelect(activeImage as IImageListEntry)
    setActiveImage(null)
    onToggle(false)
    Modal.destroyAll()
  }

  const onCancel = () => {
    onToggle(false)
    Modal.destroyAll()
  }

  const onDelete = () => {
    if (activeImage) {
      deleteAccountImage(activeImage.name)
      setActiveImage(null)
    }
  }

  return (
    <>
      <style jsx global>{`
        .storage-images-selector {
          width: 100%;
          height: 60vh;
          overflow: scroll;
          .image-item__container {
            height: 100%;
            border: 2px solid #ccc;
            border-radius: 3px;
            cursor: pointer;
            padding: 10px;
            &:hover {
              border: 2px solid #00a854;
            }
            &.active {
              border: 2px solid #00a854;
            }
            .image-item__wrapper {
              width: 100%;
              height: 100%;
              position: relative;
              background-size: contain;
              background-position: center center;
              background-repeat: no-repeat;
              .selected-icon {
                font-size: 20px;
                position: absolute;
                top: 0;
                right: 0;
              }
              img.image-item {
                width: 100%;
              }
            }
          }
        }
      `}</style>
      <Modal
        title="Select Image"
        visible={open}
        onOk={onOk}
        width={800}
        footer={[
          <TierWrapper tier={tierMap.DELETE_IMAGE.tier}>
            <Popconfirm
              title="Deleting image from library can not be undone, are you sure？"
              onConfirm={onDelete}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              <Button
                style={{ marginRight: '8px' }}
                key="delete"
                loading={delStatus.loading}
                disabled={!activeImage || listStatus.loading}
                type="danger"
              >
                Delete this image
              </Button>
            </Popconfirm>
          </TierWrapper>,
          <Button key="back" onClick={onCancel}>
            Cancel
          </Button>,
          <Button
            disabled={!activeImage || delStatus.loading || listStatus.loading}
            key="submit"
            type="primary"
            onClick={onOk}
          >
            Select
          </Button>
        ]}
        onCancel={onCancel}
      >
        {listStatus.loading ? (
          <Loading />
        ) : listStatus.error ? (
          <Alert type="error" message={listStatus.error} />
        ) : (
          <div className="storage-images-selector">
            <Row gutter={1}>
              {images.map((img) => {
                const isActive = activeImage ? activeImage.id === img.id : false
                return (
                  <Col
                    key={img.id}
                    style={{
                      marginBottom: '2px',
                      width: '188px',
                      height: '188px'
                    }}
                  >
                    <Row
                      className={`image-item__container ${
                        isActive ? 'active' : ''
                      }`}
                      justify="center"
                      align="middle"
                      onClick={() => {
                        if (isActive) {
                          setActiveImage(null)
                        } else {
                          setActiveImage(img)
                        }
                      }}
                    >
                      <div
                        className="image-item__wrapper"
                        style={{
                          backgroundImage: isPdf(img.link)
                            ? 'url("/pdf_file_icon.png")'
                            : `url(${img.link})`
                        }}
                      >
                        {/* <img className="image-item" src={img}  /> */}
                        {isActive && (
                          <CheckCircleTwoTone
                            twoToneColor={color.primary}
                            className="selected-icon"
                          />
                        )}
                      </div>
                    </Row>
                  </Col>
                )
              })}
            </Row>
          </div>
        )}
      </Modal>
    </>
  )
}

export default StorageImagesSelector
