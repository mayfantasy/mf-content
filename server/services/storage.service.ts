import { Storage } from '@google-cloud/storage'
import { env } from '../../config/env.config'
import randomstring from 'randomstring'
import { format } from 'date-fns'

const storage = new Storage({
  credentials: {
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDmsW2dTrIpVzmm\nHvNxVWoMf8ZxgbJgKfqgS7cnBRsY4NJEtLEkJHlfZ547OMwIc9IkUsktHsxWehHP\nk6qCBjuP7vdi5iVB+r8n1n9DKpgVD0tl9drfbKqy0n3bxZ+k+CZTkG24YyGOOMPU\nqNEgZCZgX0lL1j4w2tNVX2DHinLZullG9aux2pt1MqDGPYEg0eah9a4oM6L0ixIQ\nka1GFauTVK3WjNxlyn1U+CC7/jxhih5g4AmptK5HRKaQFeoSjkYu6A1hgb0bJpZe\nSAUxZhTxqKGpo1JGOI7D4HEg6piogfHrFiKwmQNC+o5ymjcwixgDL3hgMasTIyCS\naEfBqT4RAgMBAAECggEAEP6pMJmHjnwahx5omMTOFzWijOIdHfB5wi1RxNIfeOm3\nE9Cr7Bmzx09+3KYGgejmZj6jC2vlacl8XmpmeUW0RZo5J1QFEqNCSdEHdw9APOzv\nhQdjpGoA+UOAehxI8oJFcIqHSroi0rNj2drF7Tjzis36PFgAJOE6CGQKYSjV5Swt\ncNRbn/jqbFvFyVQsxpo5h/vyHxmlRXRFfuPbljhX5b7tuCe7UlSbuTrtjDcjgHtj\n/GKS9dK8E/a7f6H6PNLe8Uu+lSAlZNURP7bODodNOL1JqVQ65L1MV9McjewzGEal\n0m5WbC6sAiKfBnyV5/nhVIE7DmmVBB4ZmUZQfaYm8QKBgQD1SFwHilmIADdB+vqI\n7EFYgbFwckQDzZQzy4LlGPdc7agMxulGgts0hnTcj4IUi8U8/dnUwatvs0k7Y7kY\naxe/0MEdOhXFLgkOp6tA3a7LHVL9PyFLjl3HOLyjmy4qMXrkKwjSD3d6iVSNpq9s\n5PI8jmwc0KXUgrcxfcfIU/S1PwKBgQDwxeAIdVCXUCxAMZma8qfg8EEo+dGySeDd\nrYyivLYORXHoKXAS6fAGHGxsusPb7LvylBhFAS+IdN33Pk/+eFGh7nJzZTWJy+XZ\nwMpGDyML5StOzXTdTttbvTk0VYzeNuHTXdfSTHJVJJ4YEYFbjSVoX6E7w+Zu+JuQ\nhNSUbZCorwKBgQCc88Bv0seXjwvM3JyUIRlvWQ4BthxvkozS19baYi9m92whQObk\nh7dc1OzSdcH3A7kiXg2VZpgc0cx6hEVcqqp3w0zPNuvXUK3bAs9CopfGwOzpwAu+\nHUtEv7l1t0bDGQZaGm96ewspDdddDNwUAiw/M6NajOiQI1S2BpZgSdi8YQKBgAdT\nXe+j8iHIdLA3Uh8exvDXHoRqpXCxQsA76Y2CBGAGyOJxcFGDAKSO9NWSESd92nIV\nA3AGCzYxqBc/tBtf+cvdf2n3aFua8pFfhkf/aeeQv3KUWbvqDE6MQVNQTwrrzI8r\nycdCQDBK/uxoi/EHKF42mqdA3J//vGv3PqiNdNtNAoGAXydb1X6A/aLa3FZbxnxz\nPXJ7tdoeooEIlBEdGaYJ2IfM1pHeLj5smhGgJXCNU6YfZLb4F2BtVQKnjW1j/zsc\n1B/uMOyw3NnObjq5Wjc604kt5DdlvXSao1dKTnh4sLinn2qUeGBYeSTQy9zMnsFf\n1y9M7Oq0rXb8z14Suni2rME=\n-----END PRIVATE KEY-----\n',
    client_email: 'mf-schema@mf-schema.iam.gserviceaccount.com'
  }
})
const bucketName = env.GOOGLE_STORAGE_BUCKET_NAME

export const uploadImage = async (
  src: string,
  name: string,
  folder1: string,
  folder2: string
) => {
  if (bucketName && folder1 && folder2) {
    return await storage.bucket(bucketName).upload(src, {
      gzip: true,
      destination: `${folder1}/${folder2}/${format(
        new Date(),
        'yyyyMMdd'
      )}_${randomstring.generate(8)}_${name}`,
      metadata: {
        cacheControl: 'public, max-age=31536000'
      }
    })
  }
  return new Error('Missing params. [bucketName or folder1 or folder2]')
}

export const getAccountImages = async (path: string) => {
  if (bucketName && path) {
    const [objects] = await storage.bucket(bucketName).getFiles({
      prefix: path
    })
    return objects.map((o: any) => ({
      id: o.metadata.id,
      name: o.metadata.name,
      link: o.metadata.mediaLink
    }))
  }
  return new Error('Missing params. [bucketName or path]')
}

export const deleteAccountImage = async (filename: string) => {
  if (bucketName && filename) {
    const result = await storage
      .bucket(bucketName)
      .file(filename)
      .delete()
    return result
  }
  return new Error('Missing params. [bucketName or filename]')
}
