import React from 'react'
import {message, Upload} from 'antd'
import { InboxOutlined } from '@ant-design/icons';
const {Dragger} = Upload

const props = {
    name: 'file', 
    multiple: false, 
    action: `http://localhost:8081/admin/upload-excel`, 
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
      onDrop(e) { 
        console.log('Dropped files', e.dataTransfer.files);
    },
}

function UploadSheet({role}) {
  return (
    <div className='h-screen'>
        <h4 className="font-bold text-2xl text-[#381CA9] bg-gradient-to-r from-[#57CDFF] to-[#038ACA] px-9 py-7">
            {`Hello, ${role}`}
        </h4>
        <div className='flex justify-center items-center mt-4'>
            <div className='w-3/4 bg-home drop-shadow-2xl m-[40px]'>
                    <div className='text-center my-2 font-bold'>
                        <p>Upload Sheet Data</p>
                    </div>
                    <Dragger {...props}>
                        <p className='ant-upload-drag-icon'>
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    </Dragger>
            </div>
        </div>
    </div>
  )
}

export default UploadSheet