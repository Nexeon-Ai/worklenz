import {
  Badge,
  Button,
  DatePicker,
  Divider,
  Drawer,
  Flex,
  Form,
  Input,
  InputRef,
  Select,
  Tag,
  Typography,
} from '@/shared/antd-imports';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  healthStatusData,
  projectColors,
  statusData,
} from '../../../lib/project/project-constants';
import { PlusCircleOutlined, PlusOutlined, QuestionCircleOutlined } from '@/shared/antd-imports';
import { colors } from '../../../styles/colors';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { ProjectType } from '../../../types/project.types';
import { nanoid } from '@reduxjs/toolkit';
import { createProject, toggleDrawer, toggleUpdatedrawer } from '../projectSlice';
import ProjectList from '../../../pages/projects/ProjectList';
import { CategoryType } from '../../../types/categories.types';

const UpdateProjectDrawer = () => {
  const { t } = useTranslation('update-project-drawer');
  const currentlyActiveTeamData = useAppSelector(state => state.teamReducer.teamsList).find(
    item => item.isActive
  );

  // get categories list from categories reducer
  let categoriesList = useAppSelector(state => state.categoriesReducer.categoriesList);

  // state for show category add input box
  const [isAddCategoryInputShow, setIsAddCategoryInputShow] = useState<boolean>(false);
  const [categoryText, setCategoryText] = useState<string>('');

  const isDrawerOpen = useAppSelector(state => state.projectReducer.isUpdateDrawerOpen);
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  // status selection options
  const statusOptions = [
    ...statusData.map((status, index) => ({
      key: index,
      value: status.value,
      label: (
        <Typography.Text style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {status.icon}
          {status.label}
        </Typography.Text>
      ),
    })),
  ];

  // health selection options
  const healthOptions = [
    ...healthStatusData.map((status, index) => ({
      key: index,
      value: status.value,
      label: (
        <Typography.Text style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Badge color={status.color} /> {status.label}
        </Typography.Text>
      ),
    })),
  ];

  // project color options
  const projectColorOptions = [
    ...projectColors.map((color, index) => ({
      key: index,
      value: color,
      label: (
        <Tag
          color={color}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: 20,
            height: 20,
            borderRadius: '50%',
          }}
        />
      ),
    })),
  ];

  // category input ref
  const categoryInputRef = useRef<InputRef>(null);

  const handleCategoryInputFocus = (open: boolean) => {
    setTimeout(() => {
      categoryInputRef.current?.focus();
    }, 0);
  };

  // show input to add new category
  const handleShowAddCategoryInput = () => {
    setIsAddCategoryInputShow(true);
    handleCategoryInputFocus(true);
  };

  // function to handle category add
  const handleAddCategoryItem = (category: string) => {
    const newCategory: CategoryType = {
      categoryId: nanoid(),
      categoryName: category,
      categoryColor: '#ee87c5',
    };

    setCategoryText('');
    setIsAddCategoryInputShow(false);
  };

  interface DataType {
    key: string;
    name: string;
    client: string;
    category: string;
    status: string;
    totalTasks: number;
    completedTasks: number;
    lastUpdated: Date;
    startDate: Date | null;
    endDate: Date | null;
    members: string[];
  }

  return (
    <Drawer
      title={
        <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>{t('update-project')}</Typography.Text>
      }
      open={isDrawerOpen}
      onClose={() => dispatch(toggleUpdatedrawer(''))}
    >
      {/* create project form  */}
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          color: projectColors[0],
          status: 'proposed',
          health: 'notSet',
          client: [],
          estWorkingDays: 0,
          estManDays: 0,
          hrsPerDay: 8,
        }}
      >
        <Form.Item
          name="name"
          label={t('name-label')}
          rules={[
            {
              required: true,
              message: t('name-required'),
            },
          ]}
        >
          <Input placeholder={t('name-placeholder')} />
        </Form.Item>
        <Form.Item name="color" label={t('project-color-label')} layout="horizontal" required>
          <Select
            variant="borderless"
            suffixIcon={null}
            options={projectColorOptions}
            style={{
              width: 60,
            }}
          />
        </Form.Item>
        <Form.Item name="status" label={t('status-label')}>
          <Select options={statusOptions} />
        </Form.Item>
        <Form.Item name="health" label={t('health-label')}>
          <Select options={healthOptions} />
        </Form.Item>
        <Form.Item name="category" label={t('category-label')}>
          {!isAddCategoryInputShow ? (
            <Select
              options={categoriesList}
              placeholder={t('category-placeholder')}
              dropdownRender={() => (
                <Button
                  style={{ width: '100%' }}
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={handleShowAddCategoryInput}
                >
                  {t('new-category')}
                </Button>
              )}
            />
          ) : (
            <Flex vertical gap={4}>
              <Input
                ref={categoryInputRef}
                placeholder={t('category-input-placeholder')}
                value={categoryText}
                onChange={e => setCategoryText(e.currentTarget.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCategoryItem(categoryText)}
              />
              <Typography.Text style={{ color: colors.lightGray }}>
                {t('hit-enter-to-create')}
              </Typography.Text>
            </Flex>
          )}
        </Form.Item>
        <Form.Item name="notes" label={t('notes-label')}>
          <Input.TextArea placeholder={t('notes-placeholder')} />
        </Form.Item>
        <Form.Item
          name="client"
          label={
            <Typography.Text>
              {t('client-label')} <QuestionCircleOutlined />
            </Typography.Text>
          }
        >
          <Input placeholder={t('client-placeholder')} />
        </Form.Item>
        <Form.Item name="projectManager" label={t('project-manager-label')} layout="horizontal">
          <Button type="dashed" shape="circle" icon={<PlusCircleOutlined />} />
        </Form.Item>
        <Form.Item name="date" layout="horizontal">
          <Flex gap={8}>
            <Form.Item name="startDate" label={t('start-date-label')}>
              <DatePicker />
            </Form.Item>
            <Form.Item name="endDate" label={t('end-date-label')}>
              <DatePicker />
            </Form.Item>
          </Flex>
        </Form.Item>
        <Form.Item name="estWorkingDays" label={t('est-working-days-label')}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="estManDays" label={t('est-man-days-label')}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="hrsPerDay" label={t('hours-per-day-label')}>
          <Input type="number" />
        </Form.Item>

        <Button type="primary" style={{ width: '100%' }} htmlType="submit">
          {t('save-changes')}
        </Button>
        <Button type="dashed" danger style={{ width: '100%', marginTop: '8px' }} htmlType="submit">
          {t('delete-project')}
        </Button>
      </Form>
      <Divider style={{ marginTop: '1rem', marginBottom: '0.5rem' }} />
      <div style={{ paddingBottom: '0.25rem', display: 'flex', flexDirection: 'column' }}>
        <Typography.Text type="secondary">
          <small> {t('created-a-day-ago-by', { name: 'Raveesha Dilanka' })} </small>
        </Typography.Text>
        <Typography.Text type="secondary">
          <small> {t('updated-a-day-ago')} </small>
        </Typography.Text>
      </div>
    </Drawer>
  );
};

export default UpdateProjectDrawer;
