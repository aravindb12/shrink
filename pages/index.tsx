import Head from 'next/head'
import axios, { AxiosError } from 'axios'
import { Alert, Button, Layout, Form, Input, Typography } from 'antd'
import styles from '../styles/Home.module.css'
import { useState } from 'react';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

type ShortenedLinkResponse = {
  short_link: string;
}

type ShortenedLinkError = {
  error: string;
  error_description: string;
}

type FormValues = {
  link: string;
}

export default function Home() {

  const [status, setStatus] = useState<'initial' | 'error' | 'success'>('initial');
  const [form] = Form.useForm();
  const [message, setMessage] = useState('');

  const onFinish = async ({ link }: FormValues) => {
    try {
      const response = await axios.post<ShortenedLinkResponse>('/api/shrink_link', { link });
      setMessage(response.data?.short_link);
      setStatus('success')
    } catch (e) {
      const error = e as AxiosError<ShortenedLinkError>;
      setMessage(error.response?.data?.error_description || 'Something went wrong');
      setStatus('error');
    }
  }

  const onFinishedFailed = () => {
    const error = form.getFieldError('link').join(' ');
    setMessage(error);
    setStatus('error');
  }

  return (
    <Layout>
      <Head>
        <title>Shr.ink - URL shortener</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
 
      <Header className={styles.header}>Shr.ink</Header>
 
      <Content className={styles.content} >
        <div className={styles.shortener}>
          <Title level={5}>Copy &amp; Paste the Link here</Title>
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishedFailed}
          >
            <div className={styles.linkField} >

              <div className={styles.linkFieldInput}>
                <Form.Item noStyle name="link" rules={[{
                  required: true,
                  message: "please paste a correct link",
                  type: 'url'
                }]}>
                  <Input placeholder="Enter the Long Url" size="large" type="link" />
                </Form.Item>
              </div>

              <div className={styles.linkFieldButton}>
                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large">
                    Shrink
                  </Button>
                </Form.Item>
              </div>

            </div>
          </Form>

          {['error', 'success'].includes(status) &&
            (<Alert className={styles.linkAlert} showIcon closable message={
              status == 'success'
                ? <Paragraph className={styles.linkContent} copyable>{message}</Paragraph>
                : message
            } type={status as 'error' | 'success'} />)}
 
        </div>
      </Content>

      <Footer className={styles.footer}>
        &copy; Shr.ink
      </Footer>

    </Layout>
  )
}
