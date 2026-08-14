const profileService = require('../services/profile.service');
const authService = require('../services/auth.service');
const {
  validateCreateProfileRequest,
  validateProfileIdParam,
} = require('../schemas/request/profile.request.schema');
const { successResponse, errorResponse } = require('../schemas/response/auth.response.schema');
const { formatProfileResponse } = require('../schemas/response/profile.response.schema');
const { HTTP_STATUS } = require('../core/constants/http.constants');
const { MESSAGES } = require('../core/constants/messages.constants');

async function createProfile(req, res, next) {
  try {
    const validation = validateCreateProfileRequest(req.body);
    if (!validation.valid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(validation.message));
    }

    const { id, email, display_name, avatar_url, phone, bio, website } = req.body;

    // Verify user exists in auth.users
    const { data: authUserData, error: authError } = await authService.adminGetUserById(id);
    if (authError || !authUserData || !authUserData.user) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json(errorResponse(MESSAGES.PROFILE.AUTH_USER_NOT_FOUND));
    }

    const payload = {
      id,
      email: email || authUserData.user.email,
      display_name,
      avatar_url,
      phone,
      bio,
      website,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await profileService.insertProfile(payload);
    if (error) {
      if (error.code === '23503') {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(errorResponse(MESSAGES.PROFILE.AUTH_USER_NOT_FOUND));
      }
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }

    return res
      .status(HTTP_STATUS.CREATED)
      .json(successResponse(MESSAGES.PROFILE.CREATED, formatProfileResponse(data)));
  } catch (err) {
    next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    const validation = validateProfileIdParam(req.params);
    if (!validation.valid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(validation.message));
    }

    const { id } = req.params;
    const { data, error } = await profileService.getProfileById(id);

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse(MESSAGES.PROFILE.NOT_FOUND));
      }
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }

    return res
      .status(HTTP_STATUS.OK)
      .json(successResponse(MESSAGES.PROFILE.FETCHED, formatProfileResponse(data)));
  } catch (err) {
    next(err);
  }
}

async function upsertProfile(req, res, next) {
  try {
    const validation = validateProfileIdParam(req.params);
    if (!validation.valid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(validation.message));
    }

    const { id } = req.params;

    // Verify user exists in auth.users
    const { data: authUserData, error: authError } = await authService.adminGetUserById(id);
    if (authError || !authUserData || !authUserData.user) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json(errorResponse(MESSAGES.PROFILE.AUTH_USER_NOT_FOUND));
    }

    const { email, display_name, avatar_url, phone, bio, website } = req.body || {};
    const payload = {
      id,
      email: email || authUserData.user.email,
      display_name,
      avatar_url,
      phone,
      bio,
      website,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await profileService.upsertProfileById(payload);
    if (error) {
      if (error.code === '23503') {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(errorResponse(MESSAGES.PROFILE.AUTH_USER_NOT_FOUND));
      }
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }

    return res
      .status(HTTP_STATUS.OK)
      .json(successResponse(MESSAGES.PROFILE.UPDATED, formatProfileResponse(data)));
  } catch (err) {
    next(err);
  }
}

async function deleteProfile(req, res, next) {
  try {
    const validation = validateProfileIdParam(req.params);
    if (!validation.valid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(validation.message));
    }

    const { id } = req.params;
    const { data, error } = await profileService.deleteProfileById(id);

    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }

    if (!data || data.length === 0) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse(MESSAGES.PROFILE.NOT_FOUND));
    }

    return res
      .status(HTTP_STATUS.OK)
      .json(successResponse(MESSAGES.PROFILE.DELETED, { id }));
  } catch (err) {
    next(err);
  }
}

async function listProfiles(req, res, next) {
  try {
    const { search, skip, limit } = req.query;

    const options = {
      search: search || '',
      skip: skip !== undefined ? parseInt(skip, 10) : 0,
      limit: limit !== undefined ? parseInt(limit, 10) : 50,
    };

    if (isNaN(options.skip) || options.skip < 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse('skip must be a non-negative integer'));
    }

    if (isNaN(options.limit) || options.limit <= 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse('limit must be a positive integer'));
    }

    const { data, error } = await profileService.listProfiles(options);

    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }

    const formattedData = {
      profiles: data.profiles.map(formatProfileResponse),
      pagination: {
        total: data.total,
        skip: data.skip,
        limit: data.limit,
      },
    };

    return res
      .status(HTTP_STATUS.OK)
      .json(successResponse(MESSAGES.PROFILE.LISTED, formattedData));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createProfile,
  getProfile,
  listProfiles,
  upsertProfile,
  deleteProfile,
};
